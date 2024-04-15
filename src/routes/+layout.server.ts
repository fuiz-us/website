import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	return {
		google: locals.google,
		user: locals.user,
		session: locals.session
	};
}) satisfies LayoutServerLoad;
