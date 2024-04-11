import type { PageServerLoad } from './$types';
import { getStats } from './lib';

export type Stats = {
	openSource: number;
	design: number;
	lightweight: number;
	privacy: number;
};

export const load = (async ({ platform }) => {
	return {
		stats: await getStats(platform)
	};
}) satisfies PageServerLoad;
