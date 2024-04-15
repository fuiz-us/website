import { initializeLucia } from '$lib/auth';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, locals, platform }) => {
	if (!locals.session || !platform?.env.DATABASE) {
		return error(401);
	}
	const lucia = initializeLucia(platform.env.DATABASE);
	await lucia.invalidateSession(locals.session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
	return new Response();
};
