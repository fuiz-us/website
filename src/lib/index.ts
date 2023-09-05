import heart from '$lib/assets/cards-heart.svg';
import club from '$lib/assets/cards-club.svg';
import spade from '$lib/assets/cards-spade.svg';
import diamond from '$lib/assets/cards-diamond.svg';

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

type NamesError = 'Used' | 'Assigned';

type ServerGameIncomingMessage = {
	WaitingScreen: string[];
};

type GameIncomingMessage =
	| {
			WaitingScreen: string[];
	  }
	| {
			NameAssign: string;
	  }
	| {
			NameError: NamesError;
	  }
	| 'NameChoose';

type GameIncomingMessageState = {
	WaitingScreen: string[];
};

type Image = {
	Internet: {
		url: string;
		alt: string;
	};
};

type Media = {
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
				media?: Media;
				duration: number;
			};
	  }
	| {
			AnswersAnnouncement: {
				index?: number;
				count?: number;
				question?: string;
				media?: Media;
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
	| 'WaitingForOthers'
	| {
			MultipleChoice: MultipleChoiceIncomingMessage;
	  };
