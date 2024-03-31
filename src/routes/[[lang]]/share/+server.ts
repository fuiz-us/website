import type { IdlessFuizConfig } from '$lib/types';
import { crypto } from '@cloudflare/workers-types';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ request, platform }) => {
	let config: IdlessFuizConfig = await request.json();

	let id = crypto.randomUUID();

	platform?.env.MAP.put(crypto.randomUUID(), JSON.stringify(config));

	return json(id);
};