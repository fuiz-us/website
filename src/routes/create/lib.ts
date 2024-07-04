import { PUBLIC_PLAY_URL } from '$env/static/public';
import { removeIds } from '$lib';
import { i18n } from '$lib/i18n';
import type { IdlessFuizConfig } from '$lib/types';

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
	navigator.clipboard.writeText(PUBLIC_PLAY_URL + i18n.resolveRoute('/share') + '/' + id);
};
