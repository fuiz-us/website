import type { RequestHandler } from './$types';
import { isNotUndefined } from '$lib/util';
import { error } from '@sveltejs/kit';
import { getCreations } from '../oauthUtil';

export const GET: RequestHandler = async ({ platform, locals }) => {
	const session = await locals.auth();
	const db = platform?.env.DATABASE;
	const storage = platform?.env.BUCKET;
	const userId = session?.user?.id;

	if (!db || !userId || !storage) error(500);

	const files = await getCreations(db, userId, (f) => ({ ...f, uniqueId: f.id }));

	return new Response(JSON.stringify(files.filter(isNotUndefined)), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
