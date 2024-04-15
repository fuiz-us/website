import { sourceLanguageTag } from '$paraglide/runtime';
import type { Handle } from '@sveltejs/kit';
import { initializeLucia } from '$lib/auth';
import { dev } from '$app/environment';
import { refreshToken as refreshGoogleToken } from './routes/google/googleUtil';
import { i18n } from '$lib/i18n';

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.params.lang ?? sourceLanguageTag;

	const googleCookie = event.cookies.get('google');
	const google = googleCookie
		? await (async () => {
				try {
					const tokens = await refreshGoogleToken(JSON.parse(googleCookie));

					if (tokens === undefined) {
						event.cookies.delete('google', { path: '/' });
						return false;
					}

					event.cookies.set('google', JSON.stringify(tokens), {
						path: '/',
						httpOnly: true,
						sameSite: 'strict',
						secure: !dev,
						maxAge: 60 * 60 * 24 * 30
					});
					return true;
				} catch (e) {
					return false;
				}
		  })()
		: false;

	event.locals.google = google;

	const DB = event.platform?.env.DATABASE;

	if (DB) {
		const lucia = initializeLucia(DB);

		const sessionId = event.cookies.get(lucia.sessionCookieName);
		if (!sessionId) {
			event.locals.user = null;
			event.locals.session = null;
			return resolve(event);
		}

		const { session, user } = await lucia.validateSession(sessionId);
		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			// sveltekit types deviates from the de-facto standard
			// you can use 'as any' too
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		event.locals.user = user;
		event.locals.session = session;
	}

	return await resolve(event, {
		transformPageChunk({ done, html }) {
			//Only do it at the very end of the rendering process
			if (done) {
				return html
					.replace('%lang%', lang)
					.replace('%dir%', i18n.config.textDirection[i18n.getLanguageFromUrl(event.url)]);
			}
		}
	});
};
