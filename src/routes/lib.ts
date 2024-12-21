import type { Stats } from './+page.server';

export async function getStats(platform: Readonly<App.Platform> | undefined) {
	return (
		(await platform?.env.FUIZ_POLL.get<Stats>('stats', 'json')) ?? {
			openSource: 0,
			design: 0,
			lightweight: 0,
			privacy: 0
		}
	);
}

export async function setStats(platform: Readonly<App.Platform> | undefined, stats: Stats) {
	await platform?.env.FUIZ_POLL.put('stats', JSON.stringify(stats));
}

export async function getCounterValue(
	platform: Readonly<App.Platform> | undefined,
	name: string
): Promise<number | undefined> {
	try {
		return platform?.env.COUNTER.getCount(name) ?? undefined;
	} catch {
		return undefined;
	}
}

export async function getGamesPlayed(
	platform: Readonly<App.Platform> | undefined
): Promise<number | undefined> {
	return getCounterValue(platform, 'game_count');
}

export async function getPlayersJoined(
	platform: Readonly<App.Platform> | undefined
): Promise<number | undefined> {
	return getCounterValue(platform, 'player_count');
}
