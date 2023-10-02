<script lang="ts">
	export let src: string;
	export let alt: string;
	export let invert = false;
</script>

<button
	style:font="inherit"
	style:display="flex"
	style:height="1.4em"
	style:aspect-ratio="1/1"
	style:appearance="none"
	style:border="none"
	style:background="none"
	style:cursor="pointer"
	on:click
>
	<img
		height="100%"
		width="100%"
		style:display="flex"
		{src}
		style:filter={invert ? 'invert(1)' : ''}
		{alt}
	/>
</button>
