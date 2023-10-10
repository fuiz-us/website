<script lang="ts">
	import { base } from '$app/paths';
	import { palette_dark } from '$lib';
	import warning from '$lib/assets/warning.svg';
	import Icon from './Icon.svelte';
</script>

<div
	style:border-top="2px solid #00000080"
	style:text-align="center"
	style:font-size="clamp(1rem, 4vw, 1.25rem)"
	style:width="100%"
	style:box-sizing="border-box"
	style:font-family="Poppins"
	style:padding="8px"
	style:display="flex"
	style:align-items="center"
	style:gap="10px"
	style:justify-content="center"
	style:flex-wrap="wrap"
>
	<div>Made with 💔 in MIT.</div>
	<a
		style:text-decoration="none"
		style:background={palette_dark + '40'}
		style:color={palette_dark}
		style:padding="5px 10px"
		style:border-radius="5px"
		href="{base}/credits"
		style:display="inline-flex"
		style:align-items="center"
	>
		<Icon src={warning} alt="Not stable yet" size="1em" />
		<div>Version 0.2</div>
	</a>
</div>
