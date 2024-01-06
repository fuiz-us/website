import heart from '$lib/assets/cards-heart.svg';
import club from '$lib/assets/cards-club.svg';
import spade from '$lib/assets/cards-spade.svg';
import diamond from '$lib/assets/cards-diamond.svg';
import { PUBLIC_BACKEND_URL, PUBLIC_CORKBOARD_URL } from '$env/static/public';
import { goto } from '$app/navigation';

export const buttonColors = [
	['hsl(358, 84%, 45%)', 'hsl(358, 84%, 35%)'],
	['hsl(213, 76%, 44%)', 'hsl(213, 76%, 34%)'],
	['hsl(152, 62%, 32%)', 'hsl(152, 63%, 22%)'],
	['hsl(25, 100%, 43%)', 'hsl(25, 100%, 33%)']
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

export type IdlessMultipleChoiceAnswer = {
	correct: boolean;
	content: TextOrMedia;
};

export type MultipleChoiceAnswer = IdlessMultipleChoiceAnswer & {
	id: number;
};

export type IdlessMultipleChoiceSlide = {
	title: string;
	media?: Media;
	introduce_question: number;
	time_limit: number;
	points_awarded: number;
	answers: IdlessMultipleChoiceAnswer[];
};

export type MultipleChoiceSlide = IdlessMultipleChoiceSlide & {
	answers: MultipleChoiceAnswer[];
};

export type IdlessSlide = {
	MultipleChoice: IdlessMultipleChoiceSlide;
};

export type Slide = {
	MultipleChoice: MultipleChoiceSlide;
	id: number;
};

export type FuizConfig = {
	title: string;
	slides: Slide[];
};

export type IdlessFuizConfig = {
	title: string;
	slides: IdlessSlide[];
};

export type ExportedFuiz = {
	config: FuizConfig;
	lastEdited: number;
};

export type Creation = {
	id: number;
	title: string;
	lastEdited: number;
	slidesCount: number;
	media?: Media | undefined;
};

export type FuizOptions = {
	random_names: boolean;
	show_answers: boolean;
};

export async function getAllCreations(): Promise<[Creation[], IDBDatabase]> {
	return await new Promise((resolve, reject) => {
		const request = indexedDB.open('FuizDB', 1);
		request.addEventListener('upgradeneeded', () => {
			const db = request.result;
			db.createObjectStore('creations', { autoIncrement: true });
		});
		request.addEventListener('success', () => {
			const db = request.result;

			const creationsStore = db.transaction(['creations'], 'readonly').objectStore('creations');

			const creationsTransaction = creationsStore.openCursor();

			const creations: Creation[] = [];

			creationsTransaction.addEventListener('success', () => {
				const cursor = creationsTransaction.result;
				if (cursor) {
					const value: ExportedFuiz = cursor.value;
					creations.push({
						id: parseInt(cursor.key.toString()),
						lastEdited: value.lastEdited,
						title: value.config.title,
						slidesCount: value.config.slides.length,
						media: value.config.slides.reduce<Media | undefined>(
							(p, c) => p || c.MultipleChoice.media,
							undefined
						)
					});
					cursor.continue();
				} else {
					resolve([creations, db]);
				}
			});
		});
		request.addEventListener('error', reject);
	});
}

export async function getCreation(id: number): Promise<[FuizConfig, IDBDatabase]> {
	return await new Promise((resolve, reject) => {
		const request = indexedDB.open('FuizDB', 1);
		request.addEventListener('upgradeneeded', () => {
			const db = request.result;
			db.createObjectStore('creations', { autoIncrement: true });
		});
		request.addEventListener('success', () => {
			const db = request.result;

			const creationsStore = db.transaction(['creations'], 'readonly').objectStore('creations');

			const creationsTransaction = creationsStore.get(id);

			creationsTransaction.addEventListener('success', () => {
				const value: ExportedFuiz | undefined | null = creationsTransaction.result;

				if (value) {
					resolve([value.config, db]);
				} else {
					reject('creation was not found');
				}
			});
		});
		request.addEventListener('error', reject);
	});
}

export async function getBackendMedia(media: Media | undefined | null): Promise<Media | undefined> {
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

export function downloadJsonString(str: string, title: string) {
	const file = new File([str], title + '.toml', { type: 'application/toml', endings: 'native' });
	const url = URL.createObjectURL(file);

	const link = document.createElement('a');
	link.style.display = 'none';
	link.href = url;
	link.download = file.name;
	document.body.appendChild(link);
	link.click();

	document.body.removeChild(link);
	window.URL.revokeObjectURL(url);
}

export function getLocalConfig(config: FuizConfig): IdlessFuizConfig {
	return {
		title: config.title,
		slides: config.slides.map((slide) => ({
			MultipleChoice: {
				title: slide.MultipleChoice.title,
				points_awarded: slide.MultipleChoice.points_awarded,
				...(slide.MultipleChoice.media && { media: slide.MultipleChoice.media }),
				introduce_question: slide.MultipleChoice.introduce_question * 1000,
				time_limit: slide.MultipleChoice.time_limit * 1000,
				answers: slide.MultipleChoice.answers.map(({ content, correct }) => ({
					content,
					correct
				}))
			}
		}))
	};
}

export function getConfigFromLocal(config: IdlessFuizConfig): FuizConfig {
	return {
		title: config.title,
		slides: config.slides.map((slide, id) => ({
			MultipleChoice: {
				...slide.MultipleChoice,
				introduce_question: slide.MultipleChoice.introduce_question / 1000,
				time_limit: slide.MultipleChoice.time_limit / 1000,
				answers: slide.MultipleChoice.answers.map(({ content, correct }, id) => ({
					content,
					correct,
					id
				}))
			},
			id
		}))
	};
}

export async function getBackendConfig(config: FuizConfig): Promise<IdlessFuizConfig> {
	return {
		title: config.title,
		slides: await Promise.all(
			config.slides.map(async (slide) => ({
				MultipleChoice: {
					...slide.MultipleChoice,
					media: await getBackendMedia(slide.MultipleChoice.media),
					introduce_question: slide.MultipleChoice.introduce_question * 1000,
					time_limit: slide.MultipleChoice.time_limit * 1000,
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

export async function playJsonString(config: string): Promise<void | string> {
	const res = await bring(PUBLIC_BACKEND_URL + '/add', {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: config
	});

	if (res === undefined) {
		return 'Inaccessible Server';
	}

	if (!res.ok) {
		return await res.text();
	}

	const { game_id, watcher_id } = await res.json();

	localStorage.setItem(game_id + '_host', watcher_id);

	await goto('/host?code=' + game_id);
}

export async function playIdlessConfig(
	config: IdlessFuizConfig,
	options: FuizOptions
): Promise<void | string> {
	return await playJsonString(
		JSON.stringify({
			config,
			options
		})
	);
}

export async function playConfig(config: FuizConfig, options: FuizOptions): Promise<void | string> {
	return await playIdlessConfig(await getBackendConfig(config), options);
}
