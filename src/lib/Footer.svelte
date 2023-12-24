<script lang="ts">
	import diversity from '$lib/assets/diversity.svg';
	import balance from '$lib/assets/balance.svg';
	import Icon from './Icon.svelte';
	import Anchor from './Anchor.svelte';
</script>

<div
	style:border-top="2px solid #00000080"
	style:text-align="center"
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
	<Anchor href="https://gitlab.com/opencode-mit/fuiz-website">
		<div style:display="inline-flex" style:align-items="center" style:gap="0.2em">
			<Icon src={diversity} alt="Made by community" size="1em" />
			<div>Community Made</div>
		</div>
	</Anchor>
	<Anchor href="https://gitlab.com/opencode-mit/fuiz-website">
		<div style:display="inline-flex" style:align-items="center" style:gap="0.2em">
			<Icon src={balance} alt="free and open source" size="1em" />
			<div>GNU AGPLv3</div>
		</div>
	</Anchor>
</div>
