<script lang="ts">
	import { availableLanguageTags } from '$paraglide/runtime';
	import { page } from '$app/stores';
	import { route } from '$lib/i18n-routing';
</script>

<svelte:head>
	{#each availableLanguageTags as lang}
		<link rel="alternate" hreflang={lang} href={route($page.url.pathname, lang)} />
	{/each}
</svelte:head>
