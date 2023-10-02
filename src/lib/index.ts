import heart from '$lib/assets/cards-heart.svg';
import club from '$lib/assets/cards-club.svg';
import spade from '$lib/assets/cards-spade.svg';
import diamond from '$lib/assets/cards-diamond.svg';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { goto } from '$app/navigation';

export const buttonColors = [
	['#D4131B', '#a40e13'],
	['#1B68C5', '#155099'],
	['#1F8355', '#155b3a'],
	['#DA5C00', '#a84600']
] as const;

export const palette_light = '#fffbf5';

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

type Image = {
	Internet: {
		url: string;
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
	  };

export type IncomingMessage =
	| {
			Game: GameIncomingMessage;
	  }
	| {
			MultipleChoice: MultipleChoiceIncomingMessage;
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
	  };

export type MultipleChoiceAnswer = {
	correct: boolean;
	content: TextOrMedia;
};

export type MultipleChoiceSlide = {
	title: string;
	media: Media | null;
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

export function get_backend_config(config: FuizConfig) {
	return {
		title: config.title,
		slides: config.slides.map((slide) => ({
			MultipleChoice: {
				title: slide.MultipleChoice.title,
				media: slide.MultipleChoice.media,
				introduce_question: slide.MultipleChoice.introduce_question * 1000,
				time_limit: slide.MultipleChoice.time_limit * 1000,
				points_awarded: slide.MultipleChoice.points_awarded,
				answers: slide.MultipleChoice.answers
			}
		}))
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
			body: JSON.stringify(get_backend_config(config.config))
		});

		if (res === undefined) {
			// return reset('Inaccessible Server');
			return;
		}

		// if (!res.ok) {
		// 	return reset('Malformed JSON');
		// }

		goto('/host?code=' + (await res.text()));
	}
}
