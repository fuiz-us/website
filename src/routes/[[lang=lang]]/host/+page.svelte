<script lang="ts">
	import { page } from '$app/stores';
	import Create from './Create.svelte';
	import Host from './Host.svelte';
	import Options from './Options.svelte';

	$: code = $page.url.searchParams.get('code');

	function parseInt(str: string | null): number | null {
		if (str === null) {
			return null;
		}
		try {
			return Number.parseInt(str);
		} catch {
			return null;
		}
	}

	$: id = parseInt($page.url.searchParams.get('id'));
</script>

{#if code !== null}
	<Host {code} />
{:else if id !== null}
	<Options {id} />
{:else}
	<Create />
{/if}
