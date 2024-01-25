import { fixPublish } from '$lib/serverOnlyUtils';
import type { PublishedFuizDB } from '$lib/types';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load = (async ({ platform }) => {
	const mostPlayed = (
		((
			await platform?.env.DATABASE.prepare(
				'SELECT * FROM approved_submissions ORDER BY played_count DESC LIMIT 8'
			).all()
		)?.results || []) as PublishedFuizDB[]
	).map(fixPublish);

	const recentlyPublished = (
		((
			await platform?.env.DATABASE.prepare(
				'SELECT * FROM approved_submissions ORDER BY last_updated DESC LIMIT 8'
			).all()
		)?.results || []) as PublishedFuizDB[]
	).map(fixPublish);

	return {
		mostPlayed,
		recentlyPublished
	};
}) satisfies PageServerLoad;
