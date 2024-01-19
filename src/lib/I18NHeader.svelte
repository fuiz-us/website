<script lang="ts">
	import { availableLanguageTags } from '$paraglide/runtime';
	import { page } from '$app/stores';
	import { route } from '$lib/i18n-routing';
	import { PUBLIC_PLAY_URL } from '$env/static/public';
</script>

<svelte:head>
	{#each availableLanguageTags as lang}
		<link
			rel="alternate"
			hreflang={lang}
			href={PUBLIC_PLAY_URL + route($page.url.pathname, lang)}
		/>
	{/each}
</svelte:head>
