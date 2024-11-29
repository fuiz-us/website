<script lang="ts">
	import MediaDisplay from './MediaDisplay.svelte';
	import MediaFallback from './MediaFallback.svelte';
	import type { Media } from './types';

	interface Props {
		media: Media | undefined;
		align?: string;
		fit?: string;
		showFallback?: boolean;
	}

	let { media, align = 'center', fit = 'scale-down', showFallback = true }: Props = $props();
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
