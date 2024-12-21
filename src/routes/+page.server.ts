import type { PageServerLoad } from './$types';
import { getGamesPlayed, getPlayersJoined, getStats } from './lib';

export type Stats = {
	openSource: number;
	design: number;
	lightweight: number;
	privacy: number;
};

export const load = (async ({ platform }) => {
	const [stats, gamesPlayed, playersJoined] = await Promise.all([
		getStats(platform),
		getGamesPlayed(platform),
		getPlayersJoined(platform)
	]);

	return {
		stats,
		gamesPlayed,
		playersJoined
	};
}) satisfies PageServerLoad;
