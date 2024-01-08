import { sourceLanguageTag } from '$paraglide/runtime';

export async function handle({ event, resolve }) {
	const lang = event.params.lang ?? sourceLanguageTag;

	return await resolve(event, {
		transformPageChunk({ done, html }) {
			//Only do it at the very end of the rendering process
			if (done) {
				return html.replace('%lang%', lang);
			}
		}
	});
}
