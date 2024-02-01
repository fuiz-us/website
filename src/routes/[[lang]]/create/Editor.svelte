<script lang="ts">
	import { removeIds } from '$lib';
	import { updateCreation, type Database, type ExportedFuiz } from '$lib/storage';
	import type { FuizConfig } from '$lib/types';
	import Main from './Main.svelte';
	import Topbar from './Topbar.svelte';

	export let id: number;
	export let exportedFuiz: ExportedFuiz;
	export let config: FuizConfig;
	export let db: Database;

	$: {
		updateCreation(
			id,
			{
				...exportedFuiz,
				config: removeIds(config),
				lastEdited: Date.now()
			},
			db
		);
	}
</script>

<div
	style:min-height="100dvh"
	style:background="var(--background-color)"
	style:display="flex"
	style:flex-direction="column"
>
	<Topbar bind:title={config.title} bind:id />
	<Main bind:config />
</div>
