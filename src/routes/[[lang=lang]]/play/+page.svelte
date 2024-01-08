<script>
	import * as m from '$paraglide/messages';

	import { page } from '$app/stores';
	import { PUBLIC_PLAY_URL } from '$env/static/public';
	import Join from './Join.svelte';
	import Play from './Play.svelte';
	import { languageTag } from '$paraglide/runtime';
	import { route } from '$lib/i18n-routing';

	$: code = $page.url.searchParams.get('code');

	const title = m.play_title();
	const description = m.play_desc();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href="{PUBLIC_PLAY_URL}{route('/play', languageTag())}" />
</svelte:head>

{#if code !== null}
	<Play {code} />
{:else}
	<Join />
{/if}
