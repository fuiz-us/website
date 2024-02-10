import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDrive as getDriveService, getFileIdFromName } from '../../googleUtil';

export const GET: RequestHandler = async ({ cookies, params: { uuid } }) => {
	const service = getDriveService(cookies);

	const file = await getFileIdFromName(service, uuid + '.json');

	if (!file) error(401, 'file doesnt exist');

	return new Response(await service.content(file), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
