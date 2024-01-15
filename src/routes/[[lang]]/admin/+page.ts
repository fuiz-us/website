import type { IdlessFuizConfig } from '$lib/types';

export type OnlineFuiz = {
	author: string;
	tags: string[];
	language: string;
	config: IdlessFuizConfig;
};
