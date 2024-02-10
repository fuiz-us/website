import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDrive as getDriveService, getFileIdFromName } from '../../googleUtil';

export const GET: RequestHandler = async ({ cookies, params: { hash } }) => {
	const service = getDriveService(cookies);

	const file = await getFileIdFromName(service, hash + '.txt');

	if (!file) error(401, 'file doesnt exist');

	return new Response(await service.content(file));
};
