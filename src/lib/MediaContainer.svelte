<script lang="ts">
	import type { Media } from '$lib';
	import MediaDisplay from './MediaDisplay.svelte';

	export let media: Media | undefined;
	export let align = 'center';
</script>

<div
	style:max-height="100%"
	style:padding-top="5px"
	style:display="flex"
	style:justify-content={align}
	style:max-width="100%"
	style:position="absolute"
	style:inset="0"
>
	{#if media}
		<MediaDisplay {media} />
	{/if}
</div>
