import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	return {
		google: locals.google
	};
}) satisfies LayoutServerLoad;
