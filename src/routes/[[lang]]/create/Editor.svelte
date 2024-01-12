<script lang="ts">
	import type { ExportedFuiz } from '$lib';
	import Main from './Main.svelte';
	import Topbar from './Topbar.svelte';

	export let id: number;
	export let config: ExportedFuiz;
	export let db: IDBDatabase;

	$: {
		const creationsStore = db.transaction(['creations'], 'readwrite').objectStore('creations');
		creationsStore.put(
			{
				...config,
				lastEdited: Date.now()
			},
			id
		);
	}
</script>

<div
	style:min-height="100dvh"
	style:background="var(--background-color)"
	style:display="flex"
	style:flex-direction="column"
>
	<Topbar bind:title={config.config.title} bind:id />
	<Main bind:config={config.config} />
</div>
