import { fixPublish, type PublishedFuiz, type PublishedFuizDB } from '$lib';
import type { PageServerLoad } from './$types';

export const load = (async ({ platform }) => {
	const allPublished = ((
		await platform?.env.DATABASE.prepare('SELECT * FROM approved_submissions').all()
	)?.results || []) as PublishedFuizDB[];

	const published: PublishedFuiz[] = await Promise.all(allPublished.map(fixPublish));

	return {
		published
	};
}) satisfies PageServerLoad;
