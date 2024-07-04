import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { delay, deleteFile, getCreations } from '../oauthUtil';

export const GET: RequestHandler = async ({ locals, platform }) => {
	const session = await locals.auth();
	const db = platform?.env.DATABASE;
	const userId = session?.user?.id;
	if (!db || !userId) error(500);

	const files = await getCreations(db, userId, async (f) => {
		await delay(10);
		await deleteFile(db, userId, f.id);
	});

	return new Response(JSON.stringify(files.length), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
