import { fixPublish } from '$lib/serverOnlyUtils';
import type { PublishedFuizDB } from '$lib/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	let { term } = await request.json();

	const matches = (
		((
			await platform?.env.DATABASE.prepare(
				'SELECT * FROM approved_submissions WHERE approved_submissions MATCH ?1 ORDER BY rank LIMIT 8'
			)
				.bind(term)
				.all()
		)?.results || []) as PublishedFuizDB[]
	).map(fixPublish);

	return json(matches);
};
