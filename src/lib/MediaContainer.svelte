<script lang="ts">
	import type { Media } from '$lib';
	import MediaDisplay from './MediaDisplay.svelte';
	import MediaFallback from './MediaFallback.svelte';

	export let media: Media | undefined;
	export let align = 'center';
	export let fit = 'scale-down';
	export let showFallback = true;
</script>

<div
	style:max-height="100%"
	style:display="flex"
	style:justify-content={align}
	style:max-width="100%"
	style:margin="auto"
	style:position="absolute"
	style:inset="0"
>
	{#if media}
		<MediaDisplay {media} {fit} />
	{:else if showFallback}
		<MediaFallback />
	{/if}
</div>
