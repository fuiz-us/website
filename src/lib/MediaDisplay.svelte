<script lang="ts">
	import type { Media } from '$lib';
	import image from '$lib/assets/image.svg';
	import hourglass from '$lib/assets/hourglass.svg';

	export let media: Media;
</script>

{#if media.Image.Internet.url !== ''}
	<img
		style:height="100%"
		style:width="100%"
		style:object-fit="contain"
		style:background-color="#DDD"
		style:background-image="url('{hourglass}')"
		style:background-repeat="no-repeat"
		style:background-size="3em"
		style:background-position="center"
		alt={media.Image.Internet.alt}
		src={media.Image.Internet.url}
	/>
{:else}
	<div
		style:height="100%"
		style:width="100%"
		style:display="flex"
		style:align-items="center"
		style:justify-content="center"
		style:background="#DDD"
	>
		<img src={image} alt="fallback" style:display="flex" style:height="3em" style:width="3em" />
	</div>
{/if}
