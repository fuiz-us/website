<script lang="ts">
	import MediaContainer from '$lib/MediaContainer.svelte';
	import VerticalSplit from '$lib/Game/VerticalSplit.svelte';
	import type { OrderSlide } from '$lib/types';
	import { buttonColors } from '$lib';

	export let slide: OrderSlide;
</script>

<div
	style:display="flex"
	style:gap="0.2em"
	style:height="100%"
	style:overflow="hidden"
	style:max-height="5em"
	style:flex-direction="column"
	style:justify-content="space-between"
	style:background="var(--background-color)"
>
	<div
		style:padding="0.2em"
		style:box-sizing="border-box"
		style:box-shadow="0 2px 2px #00000040"
		style:text-align="center"
		style:font-size="0.6em"
		style:white-space="nowrap"
	>
		{slide.title ? slide.title : '...'}
	</div>
	<VerticalSplit>
		<svelte:fragment slot="top">
			{#if slide.media}
				<div style:height="50px">
					<MediaContainer media={slide.media} />
				</div>
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="bottom">
			{#each slide.answers as _, i}
				<div
					style:background={buttonColors.at(i % buttonColors.length)?.at(0) ??
						'var(--accent-color)'}
					style:margin="0.05em"
					style:border-radius="0.6em"
					style:height="0.5em"
				/>
			{/each}
		</svelte:fragment>
	</VerticalSplit>
</div>
