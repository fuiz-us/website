import type { RequestHandler } from './$types';
import { getDrive as getDriveService, getFileIdFromName } from '../../googleUtil';

export const POST: RequestHandler = async ({ request, cookies, params: { hash } }) => {
	const service = getDriveService(cookies);

	if ((await getFileIdFromName(service, `${hash}.txt`)) !== undefined) {
		return new Response();
	}

	const data = await request.text();

	await service.create(
		{ name: `${hash}.txt` },
		{
			type: 'text/plain',
			data
		}
	);

	return new Response();
};
