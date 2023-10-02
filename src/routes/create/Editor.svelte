<script lang="ts">
	import type { ExportedFuiz, FuizConfig } from '$lib';
	import Main from './Main.svelte';
	import Topbar from './Topbar.svelte';

	export let id: number;
	export let config: FuizConfig;

	function get_exported(config: FuizConfig): ExportedFuiz {
		return {
			config,
			last_edited: Date.now()
		};
	}

	$: {
		localStorage.setItem(id.toString(), JSON.stringify(get_exported(config)));
	}
</script>

<div style:height="100%" style:display="flex" style:flex-direction="column">
	<Topbar bind:title={config.title} bind:id />
	<Main bind:config />
</div>
