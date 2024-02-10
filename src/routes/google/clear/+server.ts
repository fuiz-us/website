import type { RequestHandler } from './$types';
import { delay, getCreations, getDrive as getDriveService } from '../googleUtil';

export const GET: RequestHandler = async ({ cookies }) => {
	const service = getDriveService(cookies);

	const files = await getCreations(service, async (f) => {
		await delay(10);
		await service.deleteFile(f);
	});

	return new Response(JSON.stringify(files.length), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
