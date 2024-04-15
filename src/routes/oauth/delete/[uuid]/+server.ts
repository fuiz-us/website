import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteFile } from '../../oauthUtil';

export const GET: RequestHandler = async ({ params: { uuid }, platform, locals }) => {
	const db = platform?.env.DATABASE;
	const storage = platform?.env.BUCKET;
	const userId = locals.user?.id;
	if (!db || !userId || !storage) error(500);

	await deleteFile(db, userId, uuid);

	return new Response();
};
