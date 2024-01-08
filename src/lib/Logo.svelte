<script lang="ts">
	import * as m from '$paraglide/messages';

	import logo from '$lib/assets/logo.svg';
	import logoDark from '$lib/assets/logo_dark.svg';
	import { theme, initTheme } from 'fractils';
	import { onMount } from 'svelte';

	export let height = 60;
	export let width = 150;

	onMount(() => initTheme());
</script>

<div style:height="100%" style:display="flex" style:aspect-ratio="11/4">
	<img
		src={$theme === 'dark' ? logoDark : logo}
		height="{height}px"
		width="{width}px"
		alt={m.logo_alt()}
		style:margin-right="auto"
		style:display="flex"
		style:width="auto"
	/>
</div>
