import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDrive as getDriveService, getFileIdFromName } from '../../googleUtil';
import type { StrictInternalFuiz } from '$lib/storage';

export const POST: RequestHandler = async ({ request, cookies, params: { uuid } }) => {
	const service = getDriveService(cookies);

	const file = await getFileIdFromName(service, uuid + '.json');

	if (!file) error(401, 'file doesnt exist');

	const data: StrictInternalFuiz = await request.json();

	const { config: content, ...metadata } = data;

	service.update(
		{
			id: file.id,
			name: `${uuid}.json`,
			properties: {
				...metadata
			}
		},
		{
			data: JSON.stringify(content),
			type: 'application/json'
		}
	);

	return new Response();
};
