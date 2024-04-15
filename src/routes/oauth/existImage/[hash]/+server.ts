import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { hash }, platform, locals }) => {
	const db = platform?.env.DATABASE;
	const storage = platform?.env.BUCKET;
	const userId = locals.user?.id;
	if (!db || !userId || !storage) error(500);

	return new Response(JSON.stringify((await storage.get(hash)) !== null));
};
