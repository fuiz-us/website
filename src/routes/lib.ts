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
