<script lang="ts">
	import Icon from './Icon.svelte';

	export let src: string;
	export let alt: string;
	export let size: string;
	export let padding = '0';
</script>

<button
	style:font="inherit"
	style:display="flex"
	style:aspect-ratio="1/1"
	style:appearance="none"
	style:padding
	style:box-sizing="border-box"
	style:border="none"
	style:cursor="pointer"
	style:color="inherit"
	on:click
>
	<Icon {alt} {src} {size} />
</button>

<style>
	button {
		background: none;
		border-radius: 4px;
	}

	button:where(:hover, :focus) {
		background: #00000040;
		outline: 2px solid #ffffff40;
	}
</style>
