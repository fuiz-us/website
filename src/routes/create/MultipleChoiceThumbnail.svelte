<script lang="ts">
	import { palette_light, type MultipleChoiceSlide, buttonColors } from '$lib';
	import MediaContainer from '$lib/MediaContainer.svelte';
	import VerticalSplit from '$lib/VerticalSplit.svelte';

	export let slide: MultipleChoiceSlide;
</script>

<div
	style:display="flex"
	style:gap="5px"
	style:flex-direction="column"
	style:justify-content="space-between"
	style:height="100%"
	style:background={palette_light}
>
	<div
		style:background={palette_light}
		style:padding="5px 5px"
		style:box-shadow="0 2px 2px #00000040"
		style:text-align="center"
		style:white-space="nowrap"
	>
		{slide.title ? slide.title : 'Question Title'}
	</div>
	<VerticalSplit>
		<svelte:fragment slot="top">
			{#if slide.media}
				<div style:height="100px">
					<MediaContainer media={slide.media} />
				</div>
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="bottom">
			<div
				style:display="grid"
				style:grid-template-columns="1fr 1fr"
				style:grid-template-rows="repeat({Math.ceil(slide.answers.length / 2)}, 1fr)"
				style:gap="5px"
				style:padding="5px"
			>
				{#each slide.answers.keys() as i}
					<div
						style:background={buttonColors.at(i)?.[0] ?? buttonColors[0][0]}
						style:height="1.25em"
						style:border-radius="2px"
					/>
				{/each}
			</div>
		</svelte:fragment>
	</VerticalSplit>
</div>
