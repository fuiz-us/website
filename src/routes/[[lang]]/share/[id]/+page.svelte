<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import {
		addCreation,
		generateUuid,
		loadDatabase,
		type MediaReferencedFuizConfig
	} from '$lib/storage';
	import { goto } from '$app/navigation';
	import { route } from '$lib/i18n-routing';
	import { languageTag } from '$paraglide/runtime';
	import Loading from '$lib/Loading.svelte';
	import type { IdlessFuizConfig, Media } from '$lib/types';

	export let data: PageData;

	onMount(async () => {
		const db = await loadDatabase({ google: data.google, oauth: data.user !== null });
		const config: MediaReferencedFuizConfig = JSON.parse(data.content);

		const dereferenceImage = async (hash: string) => {
			const resp = await fetch('/oauth/getImage/' + hash);
			return await resp.text();
		};

		const fuizWithoutRef: IdlessFuizConfig = {
			...config,
			slides: await Promise.all(
				config.slides.map(async (s) => ({
					MultipleChoice: {
						...(s.MultipleChoice.media
							? {
									...s.MultipleChoice,
									media: (typeof s.MultipleChoice.media === 'string'
										? undefined
										: 'HashReference' in s.MultipleChoice.media.Image
										? {
												Image: {
													Base64: {
														alt: s.MultipleChoice.media.Image.HashReference.alt,
														hash: s.MultipleChoice.media.Image.HashReference.hash,
														data: await dereferenceImage(
															s.MultipleChoice.media.Image.HashReference.hash
														)
													}
												}
										  }
										: undefined) satisfies Media | undefined
							  }
							: { ...s.MultipleChoice, media: undefined })
					}
				}))
			)
		};

		const id = await addCreation(
			{
				lastEdited: Date.now(),
				uniqueId: generateUuid(),
				versionId: 0,
				config: fuizWithoutRef
			},
			db
		);

		goto(route('/create', languageTag()) + '?id=' + id.toString());
	});
</script>

<Loading />
