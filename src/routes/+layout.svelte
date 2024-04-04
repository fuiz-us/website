<script lang="ts">
	import '@fontsource/poppins/800.css';
	import '@fontsource/atkinson-hyperlegible';

	import { navigating, page } from '$app/stores';
	import { setLanguageTag, sourceLanguageTag, type AvailableLanguageTag } from '$paraglide/runtime';
	import { browser } from '$app/environment';
	import I18NHeader from '$lib/I18NHeader.svelte';
	import { onMount } from 'svelte';
	import Loading from '$lib/Loading.svelte';

	function getLang(param: AvailableLanguageTag): AvailableLanguageTag {
		return param ?? sourceLanguageTag;
	}

	let lang: AvailableLanguageTag = sourceLanguageTag;

	$: browser && ((l) => (lang = l))(getLang($page.params.lang as AvailableLanguageTag));

	//Use the default language if no language is given
	$: setLanguageTag(lang);

	onMount(() => {
		function getTheme() {
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches) {
				return 'dark';
			} else {
				return 'light';
			}
		}

		function getOrSet(): string {
			const local = localStorage.getItem('theme');
			if (local) return local;

			const def = getTheme();
			localStorage.setItem('theme', def);
			return def;
		}

		document.documentElement.setAttribute('data-theme', getOrSet());

		mounting = false;
	});

	//Set the lang attribute on the html tag
	$: if (browser) document.documentElement.lang = lang;

	let mounting = true;

	const startTimer = (f: () => void, ms: number) => {
		let timer = setTimeout(f, ms);
		return () => {
			clearTimeout(timer);
		};
	};

	let longNavigating = false;
	let stopTimer: () => void = () => {};

	$: {
		if ($navigating) {
			stopTimer = startTimer(() => {
				longNavigating = true;
			}, 200);
		} else {
			stopTimer();
			longNavigating = false;
		}
	}

	$: console.log(longNavigating);
</script>

<I18NHeader />

{#key lang}
	{#if mounting || longNavigating}
		<Loading />
	{:else}
		<slot />
	{/if}
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

	:global(html[data-theme='light']) {
		--background-color: #fffbf5;
		--color: #241f31;
	}

	:global(html[data-theme='dark']) {
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
