import type { IdlessFuizConfig } from '$lib/types';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ request, platform }) => {
	const config: IdlessFuizConfig = await request.json();

	const id = crypto.randomUUID();

	await platform?.env.MAP.put(id, JSON.stringify(config), {
		expirationTtl: 60 * 60 * 24 * 30
	});

	return json(id);
};
