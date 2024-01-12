<script lang="ts">
	import { theme, applyTheme } from 'fractils';
	import StatedIconButton from '$lib/StatedIconButton.svelte';
	import darkMode from '$lib/assets/dark_mode.svg';
	import lightMode from '$lib/assets/light_mode.svg';

	$: state = $theme === 'dark' ? true : false;

	$: applyTheme(state ? 'dark' : 'light');
</script>

<StatedIconButton
	icons={[
		{ src: lightMode, alt: 'Switch to Dark Mode' },
		{ src: darkMode, alt: 'Switch to Light Mode' }
	]}
	bind:state
	size="1em"
/>
