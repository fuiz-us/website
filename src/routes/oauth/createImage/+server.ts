import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import objectHash from 'object-hash';

export const POST: RequestHandler = async ({ request, platform, locals }) => {
	const db = platform?.env.DATABASE;
	const storage = platform?.env.BUCKET;
	const userId = locals.user?.id;
	if (!db || !userId || !storage) error(500);

	const data = await request.text();

	const hash = objectHash(data);

	storage.put(hash, data);

	return new Response();
};
