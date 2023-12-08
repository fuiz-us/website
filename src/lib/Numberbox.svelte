<script lang="ts">
	import { beforeUpdate } from 'svelte';

	export let min = 0;
	export let max = 999;

	export let value: number;

	beforeUpdate(() => {
		value = Math.min(Math.max(Math.trunc(value), min), max);
	});
</script>

<input
	type="number"
	{min}
	{max}
	inputmode="numeric"
	bind:value
	style:display="flex"
	style:font="inherit"
	style:padding="5px"
	style:margin="0"
	style:appearance="textfield"
	style:border="none"
	style:height="100%"
	style:width="100%"
	style:box-sizing="border-box"
	style:background="none"
	style:outline="none"
	style:text-align="center"
/>

<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
