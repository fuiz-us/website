<script lang="ts">
	import type { Media } from '$lib';
	import image from '$lib/assets/image.svg';
	import hourglass from '$lib/assets/hourglass.svg';
	import { PUBLIC_CORKBOARD_URL } from '$env/static/public';

	export let media: Media;
</script>

{#if 'Base64' in media.Image}
	{#if media.Image.Base64.data !== ''}
		<img
			style:display="flex"
			style:height="100%"
			style:width="100%"
			style:object-fit="contain"
			alt={media.Image.Base64.alt}
			src={media.Image.Base64.data}
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
{:else}
	<img
		style:display="flex"
		style:height="100%"
		style:width="100%"
		style:object-fit="contain"
		style:background-color="#DDD"
		style:background-image="url('{hourglass}')"
		style:background-repeat="no-repeat"
		style:background-size="3em"
		style:background-position="center"
		src={PUBLIC_CORKBOARD_URL + '/get/' + media.Image.Clam.id}
		alt={media.Image.Clam.alt}
	/>
{/if}
