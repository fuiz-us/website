<script lang="ts">
	import { base } from '$app/paths';
	import { palette_dark } from '$lib';
	import diversity from '$lib/assets/diversity.svg';
	import balance from '$lib/assets/balance.svg';
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
	<a
		style:text-decoration="none"
		style:background={palette_dark + '40'}
		style:color={palette_dark}
		style:padding="5px 10px"
		style:gap="5px"
		style:border-radius="5px"
		href="{base}/credits"
		style:display="inline-flex"
		style:align-items="center"
	>
		<Icon src={diversity} alt="Made by community" size="1em" />
		<div>Community Made</div>
	</a>
	<a
		style:text-decoration="none"
		style:background={palette_dark + '40'}
		style:color={palette_dark}
		style:padding="5px 10px"
		style:gap="5px"
		style:border-radius="5px"
		href="https://gitlab.com/opencode-mit/fuiz-website"
		style:display="inline-flex"
		style:align-items="center"
	>
		<Icon src={balance} alt="free and open source" size="1em" />
		<div>GNU AGPLv3</div>
	</a>
</div>
