<script lang="ts">
	import type { ExportedFuiz, FuizConfig } from '$lib';
	import Main from './Main.svelte';
	import Topbar from './Topbar.svelte';

	export let id: number;
	export let config: FuizConfig;
	export let db: IDBDatabase;

	function getExported(config: FuizConfig): ExportedFuiz {
		return {
			config,
			lastEdited: Date.now()
		};
	}

	$: {
		const creationsStore = db.transaction(['creations'], 'readwrite').objectStore('creations');
		creationsStore.put(getExported(config), id);
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
