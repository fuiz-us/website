<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import StatedIconButton from '$lib/StatedIconButton.svelte';
	import darkMode from '$lib/assets/dark_mode.svg';
	import lightMode from '$lib/assets/light_mode.svg';
	import { browser } from '$app/environment';

	let theme: boolean | undefined = $state(undefined);

	function getName(state: boolean): string {
		return state ? 'dark' : 'light';
	}

	$effect(() => {
		theme = (localStorage.getItem('theme') ?? 'light') === 'dark';
	});

	$effect.pre(() => {
		if (browser && theme !== undefined) {
			localStorage.setItem('theme', getName(theme));
			document.documentElement.setAttribute('data-theme', getName(theme));
		}
	});
</script>

{#if theme !== undefined}
	<StatedIconButton
		icons={[
			{ src: lightMode, alt: m.switch_dark() },
			{ src: darkMode, alt: m.switch_light() }
		]}
		bind:state={theme}
		size="1em"
	/>
{/if}
