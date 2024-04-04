<script lang="ts">
	import { fixTimes, removeIds } from '$lib';
	import { updateCreation, type Database, type ExportedFuiz } from '$lib/storage';
	import type { FuizConfig } from '$lib/types';
	import { debounce } from '$lib/util';
	import Main from './Main.svelte';
	import Topbar from './Topbar.svelte';
	import { share } from './lib';

	export let id: number;
	export let exportedFuiz: ExportedFuiz;
	export let config: FuizConfig;
	export let db: Database;

	const updateStorage = debounce(() => {
		exportedFuiz = {
			...exportedFuiz,
			versionId: exportedFuiz.versionId + 1
		};
		updateCreation(
			id,
			{
				...exportedFuiz,
				config: fixTimes(removeIds(config)),
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
			await share(config);
		}}
	/>
	<Main bind:config />
</div>
