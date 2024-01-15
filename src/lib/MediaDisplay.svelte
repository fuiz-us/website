<script lang="ts">
	import { PUBLIC_CORKBOARD_URL } from '$env/static/public';
	import MediaFallback from './MediaFallback.svelte';
	import type { Media } from './types';

	export let media: Media;
	export let fit: string;
</script>

{#if 'Base64' in media.Image}
	{#if media.Image.Base64.data !== ''}
		<img
			style:display="flex"
			style:height="100%"
			style:width="100%"
			style:object-fit={fit}
			alt={media.Image.Base64.alt}
			src={media.Image.Base64.data}
		/>
	{:else}
		<MediaFallback />
	{/if}
{:else if 'Corkboard' in media.Image}
	<img
		style:display="flex"
		style:height="100%"
		style:width="100%"
		style:object-fit={fit}
		src={PUBLIC_CORKBOARD_URL + '/get/' + media.Image.Corkboard.id}
		alt={media.Image.Corkboard.alt}
	/>
{:else}
	<img
		style:display="flex"
		style:height="100%"
		style:width="100%"
		style:object-fit={fit}
		src={media.Image.Url.url}
		alt={media.Image.Url.alt}
	/>
{/if}
