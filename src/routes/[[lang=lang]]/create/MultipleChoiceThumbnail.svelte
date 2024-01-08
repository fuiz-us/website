<script lang="ts">
	import * as m from '$paraglide/messages';

	import { type MultipleChoiceSlide, buttonColors } from '$lib';
	import MediaContainer from '$lib/MediaContainer.svelte';
	import VerticalSplit from '$lib/Game/VerticalSplit.svelte';

	export let slide: MultipleChoiceSlide;
</script>

<div
	style:display="flex"
	style:gap="0.2em"
	style:height="4em"
	style:overflow="hidden"
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
		{slide.title ? slide.title : m.question_text()}
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
			<div
				style:display="grid"
				style:grid-template-columns="1fr 1fr"
				style:gap="0.2em"
				style:padding="0.2em"
			>
				{#each slide.answers.keys() as i}
					<div
						style:background={buttonColors.at(i % buttonColors.length)?.[0]}
						style:height="0.5em"
						style:border-radius="0.7em"
					/>
				{/each}
			</div>
		</svelte:fragment>
	</VerticalSplit>
</div>
