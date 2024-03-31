import { fixPublish } from '$lib/serverOnlyUtils';
import type { PublishedFuizDB } from '$lib/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	let { term } = await request.json();

	const matches = (
		((
			await platform?.env.DATABASE.prepare(
				'SELECT * FROM approved_submissions WHERE (title LIKE "%?1%" OR author LIKE "%?1%" OR tags LIKE "%?1%" OR alt LIKE "%?1%") LIMIT 8'
			)
				.bind(term)
				.all()
		)?.results || []) as PublishedFuizDB[]
	).map(fixPublish);

	return json(matches);
};
