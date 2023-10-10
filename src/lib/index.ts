import heart from '$lib/assets/cards-heart.svg';
import club from '$lib/assets/cards-club.svg';
import spade from '$lib/assets/cards-spade.svg';
import diamond from '$lib/assets/cards-diamond.svg';
import { PUBLIC_BACKEND_URL, PUBLIC_CORKBOARD_URL } from '$env/static/public';
import { goto } from '$app/navigation';
import { base } from '$app/paths';

export const buttonColors = [
	['#D4131B', '#a40e13'],
	['#1B68C5', '#155099'],
	['#1F8355', '#155b3a'],
	['#DA5C00', '#a84600']
] as const;

export const palette_light = '#FFFBF5';
export const palette_dark = '#241F31';

export const medal_colors = ['#FFD700', '#C0C0C0', '#CD7F32'] as const;

export const buttonSymbols = [
	[heart, 'heart'],
	[diamond, 'diamond'],
	[spade, 'spade'],
	[club, 'club']
] as const;

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

export function is_not_undefined<T>(a?: T): a is T {
	return a !== undefined;
}

export function is_not_null<T>(a: T | null): a is T {
	return a !== null;
}

type NamesError = 'Used' | 'Assigned' | 'Empty' | 'Sinful' | 'TooLong';

type WaitingScreenMessage = {
	exact_count: number;
	players: string[];
	truncated: boolean;
};

type ServerGameIncomingMessage = {
	WaitingScreen: WaitingScreenMessage;
};

type GameIncomingMessage =
	| {
			WaitingScreen: WaitingScreenMessage;
	  }
	| {
			NameAssign: string;
	  }
	| {
			NameError: NamesError;
	  }
	| 'NameChoose';

type GameIncomingMessageState = {
	WaitingScreen: WaitingScreenMessage;
};

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
	  };

export type Media = {
	Image: Image;
};

type TextOrMedia = {
	Text: string;
};

type AnswerResult = {
	correct: boolean;
	count: number;
};

type BingoIncomingMessage =
	| {
			List: {
				index: number;
				count: number;
				all_statements: {
					id: number;
					text: string;
				}[];
				assigned_statement: number[];
				crossed: number[];
				user_votes: number[];
			};
	  }
	| {
			Cross: {
				crossed: number[];
			};
	  }
	| {
			Votes: {
				user_votes: number[];
			};
	  }
	| {
			Leaderboard: {
				index: number;
				count: number;
				winners: string[];
			};
	  };

type MultipleChoiceIncomingMessage =
	| {
			QuestionAnnouncment: {
				index: number;
				count: number;
				question: string;
				media: Media | null;
				duration: number;
			};
	  }
	| {
			AnswersAnnouncement: {
				index?: number;
				count?: number;
				question?: string;
				media: Media | null;
				answers: Array<TextOrMedia>;
				answered_count?: number;
				duration: number;
			};
	  }
	| {
			AnswersCount: number;
	  }
	| {
			AnswersResults: {
				index?: number;
				count?: number;
				question?: string;
				answers?: Array<TextOrMedia>;
				results: Array<AnswerResult>;
			};
	  }
	| {
			Leaderboard: {
				index?: number;
				count?: number;
				points: Array<[string, number]>;
			};
	  };

export type ServerIncomingMessage =
	| {
			Game: ServerGameIncomingMessage;
	  }
	| {
			MultipleChoice: MultipleChoiceIncomingMessage;
	  }
	| {
			Bingo: BingoIncomingMessage;
	  };

export type IncomingMessage =
	| {
			Game: GameIncomingMessage;
	  }
	| {
			MultipleChoice: MultipleChoiceIncomingMessage;
	  }
	| {
			Bingo: BingoIncomingMessage;
	  };

export type IncomingMessageState =
	| {
			Game: GameIncomingMessageState;
	  }
	| {
			WaitingForOthers: {
				count?: number;
				index?: number;
			};
	  }
	| {
			MultipleChoice: MultipleChoiceIncomingMessage;
	  }
	| {
			Bingo: BingoIncomingMessage;
	  };

export type MultipleChoiceAnswer = {
	correct: boolean;
	content: TextOrMedia;
};

export type MultipleChoiceSlide = {
	title: string;
	media: Media | null | undefined;
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
	last_edited: number;
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

export async function get_backend_config(config: FuizConfig) {
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
					answers: slide.MultipleChoice.answers
				}
			}))
		)
	};
}

export function get_slide(id: number): ExportedFuiz | undefined {
	const config = localStorage.getItem(id.toString());
	if (config !== null) {
		return JSON.parse(config);
	} else {
		return undefined;
	}
}

export async function play_local(id: number) {
	const config = get_slide(id);
	if (config !== undefined) {
		const res = await bring(PUBLIC_BACKEND_URL + '/add', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(await get_backend_config(config.config))
		});

		if (res === undefined) {
			return;
		}

		if (!res.ok) {
			return;
		}

		goto(base + '/host?code=' + (await res.text()));
	}
}
