import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { content } from '../../oauthUtil';

export const GET: RequestHandler = async ({ params: { hash }, platform, locals }) => {
	const db = platform?.env.DATABASE;
	const storage = platform?.env.BUCKET;
	const userId = locals.user?.id;
	if (!db || !userId || !storage) error(500);

	return new Response(await content(hash, storage));
};
