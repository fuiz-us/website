<script lang="ts">
	import * as m from '$paraglide/messages';

	import { theme, setting } from '@jill64/svelte-dark-theme';
	import StatedIconButton from '$lib/StatedIconButton.svelte';
	import darkMode from '$lib/assets/dark_mode.svg';
	import lightMode from '$lib/assets/light_mode.svg';

	$: state = $theme === 'dark' ? true : false;

	$: {
		$setting = state ? 'dark' : 'light';
	}
</script>

<StatedIconButton
	icons={[
		{ src: lightMode, alt: m.switch_dark() },
		{ src: darkMode, alt: m.switch_light() }
	]}
	bind:state
	size="1em"
/>
