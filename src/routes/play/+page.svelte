<script>
	import { page } from '$app/stores';
	import { PUBLIC_PLAY_URL } from '$env/static/public';
	import Join from './Join.svelte';
	import Play from './Play.svelte';

	$: code = $page.url.searchParams.get('code');

	const title = 'Join a Game';
	const description = 'Join a current game and enter the game code';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href="{PUBLIC_PLAY_URL}/play" />
</svelte:head>

{#if code !== null}
	<Play {code} />
{:else}
	<Join />
{/if}
