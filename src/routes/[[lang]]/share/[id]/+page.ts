import { goto } from '$app/navigation';
import { route } from '$lib/i18n-routing';
import { addCreation, generateUuid, loadDatabase } from '$lib/storage';
import { languageTag } from '$paraglide/runtime';
import type { PageLoad } from './$types';

export const load = (async ({ data, parent }) => {
	const db = await loadDatabase({ google: (await parent()).google });
	const id = await addCreation(
		{
			lastEdited: Date.now(),
			uniqueId: generateUuid(),
			versionId: 0,
			config: JSON.parse(data.content)
		},
		db
	);

	goto(route('/create', languageTag()) + '?id=' + id.toString());
}) satisfies PageLoad;
