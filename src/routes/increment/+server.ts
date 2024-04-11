import { json } from '@sveltejs/kit';
import type { Stats } from '../[[lang]]/+page.server';
import { getStats, setStats } from '../[[lang]]/lib';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	const field: keyof Stats = await request.json();

	const stats = await getStats(platform);

	stats[field] += 1;

	await setStats(platform, stats);

	return json(stats);
};
