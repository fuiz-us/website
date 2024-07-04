<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import { page } from '$app/stores';
	import { PUBLIC_PLAY_URL } from '$env/static/public';
	import Join from './Join.svelte';
	import Play from './Play.svelte';
	import { browser } from '$app/environment';
	import { i18n } from '$lib/i18n';

	let code: string | null = null;

	$: browser && ((c) => (code = c))($page.url.searchParams.get('code'));

	const title = m.play_title();
	const description = m.play_desc();
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href="{PUBLIC_PLAY_URL}{i18n.resolveRoute('/play')}" />
</svelte:head>

{#if code !== null}
	<Play {code} />
{:else}
	<Join />
{/if}
