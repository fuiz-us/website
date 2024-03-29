import { sourceLanguageTag } from '$paraglide/runtime';
import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { refreshToken } from './routes/google/googleUtil';

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.params.lang ?? sourceLanguageTag;

	const session = event.cookies.get('google');
	const google = session
		? await (async () => {
				try {
					const tokens = await refreshToken(JSON.parse(session));

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

	return await resolve(event, {
		transformPageChunk({ done, html }) {
			//Only do it at the very end of the rendering process
			if (done) {
				return html.replace('%lang%', lang);
			}
		}
	});
};
