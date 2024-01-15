import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fixPublish, type PublishedFuizDB } from '$lib';

export const load = (async ({ params, platform }) => {
	const published =
		(await platform?.env.DATABASE.prepare('SELECT * FROM approved_submissions WHERE id = ?1')
			.bind(parseInt(params.id))
			.first()) || undefined;

	if (!published) {
		error(404, 'fuiz was not found');
	}

	const fuiz = await fixPublish(published as PublishedFuizDB);

	return { fuiz };
}) satisfies PageServerLoad;
