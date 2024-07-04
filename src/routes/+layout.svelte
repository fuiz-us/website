<script lang="ts">
	import '@fontsource/poppins/800.css';
	import '@fontsource/atkinson-hyperlegible';
	import 'tippy.js/dist/tippy.css';

	import { navigating } from '$app/stores';
	import Loading from '$lib/Loading.svelte';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	let mounting = true;

	const startTimer = (f: () => void, ms: number) => {
		let timer = setTimeout(f, ms);
		return () => {
			clearTimeout(timer);
		};
	};

	let longNavigating = false;
	let stopTimer: () => void = () => {
		// left empty for a reason
	};

	$: {
		if ($navigating) {
			stopTimer = startTimer(() => {
				longNavigating = true;
			}, 100);
		} else {
			stopTimer();
			longNavigating = false;
		}
	}

	onMount(() => {
		mounting = false;
	});
</script>

<ParaglideJS {i18n}>
	{#if mounting || longNavigating}
		<Loading />
	{:else}
		<slot />
	{/if}
</ParaglideJS>

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

	:global(.tippy-box[data-theme~='fuiz']) {
		background-color: var(--background-color);
		border: 3px solid;
		border-radius: 0.7em;
		padding: 0em 0.4em;
		font-size: inherit;
		color: inherit;
	}
</style>
