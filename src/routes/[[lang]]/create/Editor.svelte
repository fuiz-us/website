<script lang="ts">
	import { PUBLIC_PLAY_URL } from '$env/static/public';
	import { removeIds } from '$lib';
	import { route } from '$lib/i18n-routing';
	import { updateCreation, type Database, type ExportedFuiz } from '$lib/storage';
	import type { FuizConfig } from '$lib/types';
	import { languageTag } from '$paraglide/runtime';
	import Main from './Main.svelte';
	import Topbar from './Topbar.svelte';

	export let id: number;
	export let exportedFuiz: ExportedFuiz;
	export let config: FuizConfig;
	export let db: Database;

	const debounce = (f: () => void, ms: number) => {
		let timer: ReturnType<typeof setTimeout>;
		return () => {
			clearTimeout(timer);
			timer = setTimeout(f, ms);
		};
	};

	const updateStorage = debounce(() => {
		exportedFuiz = {
			...exportedFuiz,
			versionId: exportedFuiz.versionId + 1
		};
		updateCreation(
			id,
			{
				...exportedFuiz,
				config: removeIds(config),
				lastEdited: Date.now()
			},
			db
		);
	}, 500);

	$: {
		config && updateStorage();
	}
</script>

<div
	style:min-height="100dvh"
	style:background="var(--background-color)"
	style:display="flex"
	style:flex-direction="column"
>
	<Topbar
		bind:title={config.title}
		bind:id
		{db}
		on:share={async () => {
			let req = await fetch('/share', {
				method: 'PUT',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(removeIds(config))
			});
			let id = await req.json();
			let clipboard = new Clipboard();
			clipboard.writeText(PUBLIC_PLAY_URL + route('/share', languageTag()) + '/' + id);
			alert('Copied to the clipboard!');
		}}
	/>
	<Main bind:config />
</div>
