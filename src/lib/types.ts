import type { AvailableLanguageTag } from '$paraglide/runtime';

export type Image =
	| {
			Base64: {
				data: string;
				hash?: string;
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

export type MultipleChoiceSlide = Modify<
	IdlessMultipleChoiceSlide,
	{
		answers: MultipleChoiceAnswer[];
	}
>;

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
	no_leaderboard: boolean;
	teams?: {
		size: number;
		assign_random: boolean;
	};
};

export type ServerPossiblyHidden<T> =
	| {
			Visible: T;
	  }
	| 'Hidden';

export type PublishedFuizDB = {
	id: number;
	title: string;
	author: string;
	published: number;
	public_url: string;
	tags: string;
	slides_count: number;
	thumbnail: ArrayBuffer | null;
	alt: string | null;
	played_count: number;
	last_updated: number;
	language: string;
};

// https://gist.github.com/ackvf/de21847e78083034252961d550963579#file-global-d-ts-L154
export type Modify<T, R extends PartialAny<T>> = Omit<T, keyof R> & R;
/* eslint-disable */
type PartialAny<T> = {
	[P in keyof T]?: any;
};

export type PublishedFuiz = Modify<
	PublishedFuizDB,
	{
		thumbnail: string | null;
		tags: string[];
		published: Date;
		last_updated: Date;
		language: AvailableLanguageTag;
	}
>;
