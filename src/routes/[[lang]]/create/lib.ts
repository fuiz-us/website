import { PUBLIC_PLAY_URL } from '$env/static/public';
import { removeIds } from '$lib';
import { route } from '$lib/i18n-routing';
import type { IdlessFuizConfig } from '$lib/types';
import { languageTag } from '$paraglide/runtime';

export const share = async (config: IdlessFuizConfig, id?: string) => {
	id ??= await (
		await fetch('/share', {
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(removeIds(config))
		})
	).json();
	navigator.clipboard.writeText(PUBLIC_PLAY_URL + route('/share', languageTag()) + '/' + id);
};
