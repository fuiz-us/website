<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { addCreation, generateUuid, loadDatabase } from '$lib/storage';
	import { goto } from '$app/navigation';
	import { route } from '$lib/i18n-routing';
	import { languageTag } from '$paraglide/runtime';
	import Loading from '$lib/Loading.svelte';

	export let data: PageData;

	onMount(async () => {
		const db = await loadDatabase({ google: data.google });
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
	});
</script>

<Loading />
