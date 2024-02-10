import type { RequestHandler } from './$types';
import { getDrive as getDriveService, getFileIdFromName } from '../../googleUtil';

export const GET: RequestHandler = async ({ cookies, params: { hash } }) => {
	const service = getDriveService(cookies);

	return new Response(
		JSON.stringify((await getFileIdFromName(service, hash + '.txt')) !== undefined)
	);
};
