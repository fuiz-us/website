import type { RequestHandler } from './$types';
import { getDrive as getDriveService, getImages } from '../googleUtil';
import { isNotUndefined } from '$lib/util';

export const GET: RequestHandler = async ({ cookies }) => {
	const service = getDriveService(cookies);

	const files: Array<string | undefined> = await getImages(service, (f) =>
		f.name?.split('.')?.at(0)
	);

	return new Response(JSON.stringify(files.filter(isNotUndefined)), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
