<script lang="ts">
	import type { ExportedFuiz, FuizConfig } from '$lib';
	import Main from './Main.svelte';
	import Topbar from './Topbar.svelte';

	export let id: number;
	export let config: FuizConfig;
	export let db: IDBDatabase;

	function get_exported(config: FuizConfig): ExportedFuiz {
		return {
			config,
			last_edited: Date.now()
		};
	}

	$: {
		const creationsStore = db.transaction(['creations'], 'readwrite').objectStore('creations');
		creationsStore.put(get_exported(config), id);
	}
</script>

<div
	style:height="100%"
	style:background="var(--background-color)"
	style:display="flex"
	style:flex-direction="column"
>
	<Topbar bind:title={config.title} bind:id {db} />
	<Main bind:config />
</div>
