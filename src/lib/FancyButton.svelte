<script>
	import FancyButtonBase from './FancyButtonBase.svelte';
	export let foregroundColor = '#FFFFFF';
	export let backgroundColor = '#D4131B';
	export let backgroundDeepColor = '#a40e13';
	export let disabled = false;
</script>

<FancyButtonBase
	bind:foregroundColor
	bind:backgroundColor
	bind:backgroundDeepColor
	bind:disabled
	on:click
>
	<div
		style:height="100%"
		style:padding="5px"
		style:font-weight="bold"
		style:box-sizing="border-box"
	>
		<slot />
	</div>
</FancyButtonBase>
