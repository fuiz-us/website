import { fixPublish } from '$lib/serverOnlyUtils';
import type { PublishedFuizDB } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load = (async ({ platform }) => {
	const allPublished = ((
		await platform?.env.DATABASE.prepare('SELECT * FROM approved_submissions').all()
	)?.results || []) as PublishedFuizDB[];

	const published = allPublished.map(fixPublish);

	return {
		published
	};
}) satisfies PageServerLoad;
