import type { RequestHandler } from './$types';
import { getDrive as getDriveService } from '../../googleUtil';
import type { StrictInternalFuiz } from '$lib/storage';

export const POST: RequestHandler = async ({ request, cookies, params: { uuid } }) => {
	const service = getDriveService(cookies);

	const data: StrictInternalFuiz = await request.json();

	const { config: content, ...metadata } = data;

	await service.create(
		{
			name: `${uuid}.json`,
			properties: {
				...metadata
			}
		},
		{
			type: 'application/json',
			data: JSON.stringify(content)
		}
	);

	return new Response();
};
