import type { RequestHandler } from './$types';
import type { StrictInternalFuiz } from '$lib/storage';
import { error } from '@sveltejs/kit';
import { create } from '../../oauthUtil';

export const POST: RequestHandler = async ({ request, params: { uuid }, platform, locals }) => {
	const db = platform?.env.DATABASE;
	const storage = platform?.env.BUCKET;
	const userId = locals.user?.id;
	if (!db || !userId || !storage) error(500);

	const data: StrictInternalFuiz = await request.json();

	const { config: content, ...metadata } = data;

	await create(
		{
			id: uuid,
			lastEdited: metadata.lastEdited,
			versionId: metadata.versionId,
			creator: userId
		},
		JSON.stringify(content),
		db,
		storage
	);

	return new Response();
};
