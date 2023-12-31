import heart from '$lib/assets/cards-heart.svg';
import club from '$lib/assets/cards-club.svg';
import spade from '$lib/assets/cards-spade.svg';
import diamond from '$lib/assets/cards-diamond.svg';
import { PUBLIC_BACKEND_URL, PUBLIC_CORKBOARD_URL } from '$env/static/public';
import { goto } from '$app/navigation';

export const buttonColors = [
	['#D4131B', '#a40e13'],
	['#1B68C5', '#155099'],
	['#1F8355', '#155b3a'],
	['#DA5C00', '#a84600']
] as const;

export const medalColors = ['#FEDD1E', '#D0D0D0', '#D7995A'] as const;

export const buttonSymbols = [
	[heart, 'heart'],
	[diamond, 'diamond'],
	[spade, 'spade'],
	[club, 'club']
] as const;

// must be a subset of https://gitlab.com/opencode-mit/fuiz/-/raw/main/config.toml
export const limits = {
	fuiz: {
		maxSlidesCount: 100,
		maxTitleLength: 100,
		maxPlayerCount: 1000,
		multipleChoice: {
			maxTitleLength: 100,
			introduceQuestion: 3,
			pointsAwarded: 1000,
			allowedTimeLimits: [5, 10, 30, 60, 120, 240],
			defaultTimeLimit: 30,
			maxAnswerCount: 8
		},
		maxAnswerTextLength: 100
	}
} as const;

export async function bring(
	input: URL | RequestInfo,
	init?: RequestInit | undefined
): Promise<Response | undefined> {
	try {
		return await fetch(input, init);
	} catch (e) {
		return undefined;
	}
}

export function zip<T, U>(a: Array<T>, b: Array<U>): Array<[T, U]> {
	if (a.length < b.length) {
		return a.map((v, i) => [v, b[i]]);
	}
	return b.map((v, i) => [a[i], v]);
}

export function isNotUndefined<T>(a?: T): a is T {
	return a !== undefined;
}

export function isNotNull<T>(a: T | null): a is T {
	return a !== null;
}

type Image =
	| {
			Base64: {
				data: string;
				alt: string;
			};
	  }
	| {
			Corkboard: {
				id: string;
				alt: string;
			};
	  }
	| {
			Url: {
				url: string;
				alt: string;
			};
	  };

export type Media = {
	Image: Image;
};

export type TextOrMedia = {
	Text: string;
};

export type AnswerResult = {
	correct: boolean;
	count: number;
};

export type MultipleChoiceAnswer = {
	correct: boolean;
	content: TextOrMedia;
	id: number;
};

export type MultipleChoiceSlide = {
	title: string;
	media: Media | undefined;
	introduce_question: number;
	time_limit: number;
	points_awarded: number;
	answers: MultipleChoiceAnswer[];
};

export type Slide = {
	MultipleChoice: MultipleChoiceSlide;
	id: number;
};

export type FuizConfig = {
	title: string;
	slides: Slide[];
};

export type ExportedFuiz = {
	config: FuizConfig;
	lastEdited: number;
};

export async function get_backend_media(
	media: Media | undefined | null
): Promise<Media | undefined> {
	if (!media) {
		return undefined;
	}
	if ('Base64' in media.Image) {
		const image_res = await bring(media.Image.Base64.data);

		if (image_res === undefined) {
			return undefined;
		}

		const blob = await image_res.blob();

		const form_data = new FormData();

		form_data.append('image', blob);

		const res = await bring(PUBLIC_CORKBOARD_URL + '/upload', {
			method: 'POST',
			mode: 'cors',
			body: form_data
		});

		const v = await res?.json();

		if (v === undefined) {
			return undefined;
		}

		return {
			Image: {
				Corkboard: {
					id: v,
					alt: media.Image.Base64.alt
				}
			}
		};
	} else {
		return media;
	}
}

export async function getBackendConfig(config: FuizConfig) {
	return {
		title: config.title,
		slides: await Promise.all(
			config.slides.map(async (slide) => ({
				MultipleChoice: {
					title: slide.MultipleChoice.title,
					media: await get_backend_media(slide.MultipleChoice.media),
					introduce_question: slide.MultipleChoice.introduce_question * 1000,
					time_limit: slide.MultipleChoice.time_limit * 1000,
					points_awarded: slide.MultipleChoice.points_awarded,
					answers: slide.MultipleChoice.answers.map(({ content, correct }) => ({
						content,
						correct
					}))
				}
			}))
		)
	};
}

export async function getSlide(id: number, db: IDBDatabase): Promise<ExportedFuiz | undefined> {
	return await new Promise((resolve) => {
		const creationsStore = db.transaction(['creations'], 'readwrite').objectStore('creations');
		const transaction = creationsStore.get(id);

		transaction.addEventListener('success', () => {
			resolve(transaction.result);
		});

		transaction.addEventListener('error', () => {
			resolve(undefined);
		});
	});
}

export async function playLocal(id: number, db: IDBDatabase) {
	const config = await getSlide(id, db);
	if (config !== undefined) {
		const res = await bring(PUBLIC_BACKEND_URL + '/add', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(await getBackendConfig(config.config))
		});

		if (res === undefined) {
			return;
		}

		if (!res.ok) {
			return;
		}

		const { game_id, watcher_id } = await res.json();

		localStorage.setItem(game_id + '_host', watcher_id);

		goto('/host?code=' + game_id);
	}
}
