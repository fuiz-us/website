import { fixPublish } from '$lib/serverOnlyUtils';
import type { PublishedFuizDB } from '$lib/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	let { term } = await request.json();

	let fixedTerm = `%${term}%`;

	const matches = (
		((
			await platform?.env.DATABASE.prepare(
				'SELECT * FROM approved_submissions WHERE (title LIKE ? OR author LIKE ? OR tags LIKE ? OR alt LIKE ?) LIMIT 8'
			)
				.bind(fixedTerm, fixedTerm, fixedTerm, fixedTerm)
				.all()
		)?.results || []) as PublishedFuizDB[]
	).map(fixPublish);

	return json(matches);
};
