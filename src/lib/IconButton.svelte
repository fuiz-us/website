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
	style:background="none"
	style:cursor="pointer"
	on:click
>
	<Icon {alt} {src} {size} />
</button>
