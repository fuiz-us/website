<script>
	import { page } from '$app/stores';
	import Join from './Join.svelte';
	import Play from './Play.svelte';

	$: code = $page.url.searchParams.get('code');
</script>

{#if code !== null}
	<Play {code} />
{:else}
	<Join />
{/if}
