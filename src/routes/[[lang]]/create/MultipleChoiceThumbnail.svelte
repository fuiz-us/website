<script lang="ts">
	import * as m from '$paraglide/messages';

	import { buttonColors } from '$lib';
	import MediaContainer from '$lib/MediaContainer.svelte';
	import VerticalSplit from '$lib/Game/VerticalSplit.svelte';
	import type { MultipleChoiceSlide } from '$lib/types';

	export let slide: MultipleChoiceSlide;
</script>

<div
	style:display="flex"
	style:gap="0.2em"
	style:height="100%"
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
			{#if slide.answers.filter((a) => a.correct).length}
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
			{:else}
				<div
					style:font-size="18px"
					style:padding="0.2em 0.1em"
					style:font-weight="bold"
					style:background="#F5C211"
					style:flex="1"
				>
					{#if slide.answers.length}
						{m.no_correct()}
					{:else}
						{m.no_answers()}
					{/if}
				</div>
			{/if}
		</svelte:fragment>
	</VerticalSplit>
</div>
