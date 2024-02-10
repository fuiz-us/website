import type { RequestHandler } from './$types';
import { getCreations, getDrive as getDriveService } from '../googleUtil';
import { isNotUndefined } from '$lib/util';
import type { StrictInternalFuizMetadata } from '$lib/storage';

export const GET: RequestHandler = async ({ cookies }) => {
	const service = getDriveService(cookies);

	const files = await getCreations<StrictInternalFuizMetadata | undefined>(service, (f) => {
		const { lastEdited, versionId, uniqueId } = f.properties ?? {
			lastEdited: undefined,
			versionId: undefined,
			uniqueId: undefined
		};
		if (!lastEdited || !versionId || !uniqueId) return undefined;
		return {
			lastEdited: parseInt(lastEdited),
			versionId: parseInt(versionId),
			uniqueId
		};
	});

	return new Response(JSON.stringify(files.filter(isNotUndefined)), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
