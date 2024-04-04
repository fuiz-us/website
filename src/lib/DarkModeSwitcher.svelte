<script lang="ts">
	import * as m from '$paraglide/messages';

	import StatedIconButton from '$lib/StatedIconButton.svelte';
	import darkMode from '$lib/assets/dark_mode.svg';
	import lightMode from '$lib/assets/light_mode.svg';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let state: boolean | undefined = undefined;

	function getName(state: boolean): string {
		return state ? 'dark' : 'light';
	}

	onMount(() => {
		state = (localStorage.getItem('theme') ?? 'light') === 'dark';
	});

	$: {
		if (browser && state !== undefined) {
			localStorage.setItem('theme', getName(state));
			document.documentElement.setAttribute('data-theme', getName(state));
		}
	}
</script>

{#if state !== undefined}
	<StatedIconButton
		icons={[
			{ src: lightMode, alt: m.switch_dark() },
			{ src: darkMode, alt: m.switch_light() }
		]}
		bind:state
		size="1em"
	/>
{/if}
