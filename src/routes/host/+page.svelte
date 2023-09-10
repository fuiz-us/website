<script lang="ts">
	import { page } from '$app/stores';
	import Create from './Create.svelte';
	import Host from './Host.svelte';

	$: code = $page.url.searchParams.get('code');
</script>

{#if code !== null}
	<Host {code} />
{:else}
	<Create />
{/if}
