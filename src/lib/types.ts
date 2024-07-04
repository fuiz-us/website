import type { AvailableLanguageTag } from '$lib/paraglide/runtime.js';

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

export type GenericIdlessMultipleChoiceSlide<T> = {
	title: string;
	media?: T;
	introduce_question: number;
	time_limit: number;
	points_awarded: number;
	answers: IdlessMultipleChoiceAnswer[];
};

export type IdlessMultipleChoiceSlide = GenericIdlessMultipleChoiceSlide<Media | undefined>;

export type GenericIdlessTypeAnswer<T> = {
	title: string;
	media?: T;
	time_limit: number;
	points_awarded: number;
	answers: string[];
};

export type IdlessTypeAnswer = GenericIdlessTypeAnswer<Media | undefined>;

export type GenericMultipleChoiceSlide<T> = Modify<
	GenericIdlessMultipleChoiceSlide<T>,
	{
		answers: MultipleChoiceAnswer[];
	}
>;

export type MultipleChoiceSlide = GenericMultipleChoiceSlide<Media | undefined>;

export type GenericTypeAnswer<T> = Modify<
	GenericIdlessTypeAnswer<T>,
	{
		answers: {
			text: string;
			id: number;
		}[];
	}
>;

export type TypeAnswer = GenericTypeAnswer<Media | undefined>;

export function getMedia<T>(slide: GenericIdlessSlide<T> | GenericSlide<T>): T | undefined {
	if ('MultipleChoice' in slide) return slide.MultipleChoice.media;
	if ('TypeAnswer' in slide) return slide.TypeAnswer.media;
	return undefined;
}

export async function mapMedia<T, O>(
	slide: GenericSlide<T>,
	map: (media: T) => Promise<O>
): Promise<GenericSlide<O>> {
	if ('MultipleChoice' in slide)
		return slide.MultipleChoice.media
			? {
					MultipleChoice: { ...slide.MultipleChoice, media: await map(slide.MultipleChoice.media) },
					id: slide.id
			  }
			: {
					MultipleChoice: {
						title: slide.MultipleChoice.title,
						introduce_question: slide.MultipleChoice.introduce_question,
						time_limit: slide.MultipleChoice.time_limit,
						points_awarded: slide.MultipleChoice.points_awarded,
						answers: slide.MultipleChoice.answers
					},
					id: slide.id
			  };
	if ('TypeAnswer' in slide)
		return slide.TypeAnswer.media
			? {
					TypeAnswer: { ...slide.TypeAnswer, media: await map(slide.TypeAnswer.media) },
					id: slide.id
			  }
			: {
					TypeAnswer: {
						title: slide.TypeAnswer.title,
						time_limit: slide.TypeAnswer.time_limit,
						points_awarded: slide.TypeAnswer.points_awarded,
						answers: slide.TypeAnswer.answers
					},
					id: slide.id
			  };
	return slide;
}

export async function mapIdlessMedia<T, O>(
	slide: GenericIdlessSlide<T>,
	map: (media: T) => Promise<O>
): Promise<GenericIdlessSlide<O>> {
	if ('MultipleChoice' in slide)
		return slide.MultipleChoice.media
			? {
					MultipleChoice: { ...slide.MultipleChoice, media: await map(slide.MultipleChoice.media) }
			  }
			: {
					MultipleChoice: {
						title: slide.MultipleChoice.title,
						introduce_question: slide.MultipleChoice.introduce_question,
						time_limit: slide.MultipleChoice.time_limit,
						points_awarded: slide.MultipleChoice.points_awarded,
						answers: slide.MultipleChoice.answers
					}
			  };
	if ('TypeAnswer' in slide)
		return slide.TypeAnswer.media
			? {
					TypeAnswer: { ...slide.TypeAnswer, media: await map(slide.TypeAnswer.media) }
			  }
			: {
					TypeAnswer: {
						title: slide.TypeAnswer.title,
						time_limit: slide.TypeAnswer.time_limit,
						points_awarded: slide.TypeAnswer.points_awarded,
						answers: slide.TypeAnswer.answers
					}
			  };
	return slide;
}

export type GenericIdlessSlide<T> =
	| {
			MultipleChoice: GenericIdlessMultipleChoiceSlide<T>;
	  }
	| {
			TypeAnswer: GenericIdlessTypeAnswer<T>;
	  };

export type IdlessSlide = GenericIdlessSlide<Media | undefined>;

export type GenericSlide<T> =
	| {
			MultipleChoice: GenericMultipleChoiceSlide<T>;
			id: number;
	  }
	| {
			TypeAnswer: GenericTypeAnswer<T>;
			id: number;
	  };

export type Slide = GenericSlide<Media | undefined>;

export type GenericFuizConfig<T> = {
	title: string;
	slides: GenericSlide<T>[];
};

export type FuizConfig = GenericFuizConfig<Media | undefined>;

export type GenericIdlessFuizConfig<T> = {
	title: string;
	slides: GenericIdlessSlide<T>[];
};

export type IdlessFuizConfig = GenericIdlessFuizConfig<Media | undefined>;

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
	storage_id: number;
	title: string;
	author: string;
	published_at: string;
	public_url: string;
	subjects: string;
	grades: string;
	slides_count: number;
	played_count: number;
	thumbnail_alt: string | null;
	language_code: string;
	thumbnail: ArrayBuffer | null;
};

export const grades = ['University', 'Secondary-School', 'Primary-School', 'Other'] as const;

export const subjects = [
	'Art',
	'Business',
	'Computer Science',
	'Culture and Traditions',
	'English Language Arts',
	'Finance',
	'General Knowledge',
	'Geography',
	'History',
	'Languages',
	'Law',
	'Math',
	'Music',
	'Science',
	'Seasonal',
	'Social Emotional Learning',
	'Social Studies',
	'Trivia'
] as const;

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
		subjects: string[];
		grades: string[];
		published_at: Date;
		language: AvailableLanguageTag;
	}
>;

export type OnlineFuiz = {
	author: string;
	subjects?: string[];
	grades?: string[];
	language: string;
	config: IdlessFuizConfig;
};
