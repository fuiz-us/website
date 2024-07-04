import { providerMap } from '../auth';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.auth();

	return {
		session,
		providers: providerMap
	};
}) satisfies LayoutServerLoad;
