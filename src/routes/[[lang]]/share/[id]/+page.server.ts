import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, platform }) => {
	const id = params.id;

	const content = await platform?.env.BUCKET.get(id);

	if (!content) {
		error(404, 'fuiz not found');
	}

	return {
		content
	};
}) satisfies PageServerLoad;
