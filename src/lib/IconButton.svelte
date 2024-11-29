<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		src: string;
		alt: string;
		size: string;
		disabled?: boolean;
		padding?: string;
		onclick?: () => void;
		onmouseover?: () => void;
		onmouseenter?: () => void;
		onfocus?: () => void;
	}

	let {
		src,
		alt,
		size,
		disabled = false,
		padding = '0',
		onclick,
		onmouseover,
		onmouseenter,
		onfocus
	}: Props = $props();
</script>

<button
	style:font="inherit"
	style:display="flex"
	style:aspect-ratio="1/1"
	style:appearance="none"
	style:padding
	style:box-sizing="border-box"
	style:border="none"
	style:cursor={disabled ? 'normal' : 'pointer'}
	style:opacity={disabled ? '0.7' : '1'}
	style:color="inherit"
	{disabled}
	{onclick}
	{onmouseover}
	{onmouseenter}
	{onfocus}
>
	<Icon {alt} {src} {size} />
</button>

<style>
	button {
		background: none;
		border-radius: 4px;
	}

	button:where(:global(:hover, :focus)) {
		background: #00000040;
		outline: 2px solid #ffffff40;
	}
</style>
