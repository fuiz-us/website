<script lang="ts">
	import Icon from './Icon.svelte';

	export let message: string;
	export let image: { src: string; alt: string };
	export let background: string;
	export let color: string;
</script>

{#if message}
	<div
		style:width="100%"
		style:display="flex"
		style:align-items="center"
		style:background
		style:padding="5px 10px"
		style:box-sizing="border-box"
		style:border-radius="5px"
		style:gap="10px"
		style:color
		style:font-weight="bold"
		style:border="1px solid {color}"
		style:word-wrap="anywhere"
	>
		<Icon size="1em" src={image.src} alt={image.alt} />
		<div style:flex="1" style:text-align="center">
			{message}
		</div>
	</div>
{/if}
