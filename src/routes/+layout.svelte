<script lang="ts">
	import '@fontsource/poppins/800.css';
	import '@fontsource/atkinson-hyperlegible';

	import { page } from '$app/stores';
	import { setLanguageTag, sourceLanguageTag, type AvailableLanguageTag } from '$paraglide/runtime';
	import { browser } from '$app/environment';
	import I18NHeader from '$lib/I18NHeader.svelte';
	import { ThemeManager } from '@jill64/svelte-dark-theme';

	//Use the default language if no language is given
	$: lang = ($page.params.lang as AvailableLanguageTag) ?? sourceLanguageTag;
	$: setLanguageTag(lang);

	//Set the lang attribute on the html tag
	$: if (browser) document.documentElement.lang = lang;
</script>

<I18NHeader />
<ThemeManager />

{#key lang}
	<slot />
{/key}

<style>
	:root {
		--background-color: #fffbf5;
		--color: #241f31;
		--palette-light: #fffbf5;
		--palette-dark: #241f31;
		--accent-color: #d4131b;

		@media (prefers-color-scheme: dark) {
			--background-color: #241f31;
			--color: #fffbf5;
		}
	}

	:global(html.light) {
		--background-color: #fffbf5;
		--color: #241f31;
	}

	:global(html.dark) {
		--background-color: #241f31;
		--color: #fffbf5;
	}

	:global(body) {
		font-family: 'Atkinson Hyperlegible', sans-serif;
		font-size: 32px;
		color: var(--color);
	}

	:global(html) {
		background: var(--background-color);
	}
</style>
