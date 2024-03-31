import { fixPublish } from '$lib/serverOnlyUtils';
import type { PublishedFuizDB } from '$lib/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	let { term } = await request.json();

	const matches = (
		((
			await platform?.env.DATABASE.prepare(
				'SELECT * FROM approved_submissions WHERE (title LIKE "%?1%" OR author LIKE "%?2%" OR tags LIKE "%?3%" OR alt LIKE "%?4%") LIMIT 8'
			)
				.bind(term, term, term, term)
				.all()
		)?.results || []) as PublishedFuizDB[]
	).map(fixPublish);

	return json(matches);
};
