import type { IdlessFuizConfig } from '$lib/types';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ request, platform }) => {
	let config: IdlessFuizConfig = await request.json();

	let id = crypto.randomUUID();

	await platform?.env.BUCKET.put(id, JSON.stringify(config));

	return json(id);
};
