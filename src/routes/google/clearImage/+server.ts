import type { RequestHandler } from './$types';
import { delay, getDrive as getDriveService, getImages } from '../googleUtil';

export const GET: RequestHandler = async ({ cookies }) => {
	const service = getDriveService(cookies);

	const files = await getImages<void>(service, async (f) => {
		await delay(10);
		await service.deleteFile(f);
	});

	return new Response(JSON.stringify(files.length), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
