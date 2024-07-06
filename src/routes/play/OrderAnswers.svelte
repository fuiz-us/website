<script lang="ts">
	import TextBar from '$lib/Game/TextBar.svelte';
	import MediaDisplay from '$lib/MediaDisplay.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import FancyButton from '$lib/FancyButton.svelte';
	import type { Media } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import downArrow from '$lib/assets/arrow-down.svg';
	import Topbar from './Topbar.svelte';
	import TextAnswerButton from '$lib/Game/TextAnswerButton.svelte';
	import IconButton from '$lib/IconButton.svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	const dispatch = createEventDispatcher<{
		answer: string[];
	}>();

	export let questionText: string;
	export let name: string;
	export let score: number;
	export let media: undefined | Media;
	export let axisLabels: { from?: string; to?: string };
	export let showAnswers: boolean;
	export let answers: string[];

	$: answersIndexed = answers.map((answer, index) => ({ answer, id: index }));

	async function handleConsider(e: CustomEvent<DndEvent<{ answer: string; id: number }>>) {
		answersIndexed = e.detail.items;
	}

	async function handleFinalize(e: CustomEvent<DndEvent<{ answer: string; id: number }>>) {
		answersIndexed = e.detail.items;
	}
</script>

<div style:height="100%" style:display="flex" style:flex-direction="column">
	<div>
		<Topbar {name} {score} />
		{#if showAnswers}
			<TextBar text={questionText} />
		{/if}
	</div>
	<div style:flex="1">
		<NiceBackground>
			<div style:height="100%" style:display="flex" style:flex-direction="column">
				{#if media && showAnswers}
					<div style:height="40dvh">
						<MediaDisplay {media} fit="contain" />
					</div>
				{/if}
				<div
					style:display="flex"
					style:flex-direction="column"
					style:justify-content="center"
					style:gap="0.4em"
					style:padding="1em"
				>
					{#if axisLabels.from?.length}
						<div>{axisLabels.from}</div>
					{/if}
					<div style:display="flex" style:justify-content="space-between">
						<div
							style:display="flex"
							style:align-items="center"
							style:padding="0 0.5em"
							style:flex-direction="column"
						>
							<!-- arrow body -->
							<div
								style:width="0.2em"
								style:height="100%"
								style:background-color="currentColor"
								style:box-sizing="border-box"
							/>
							<!-- arrow head -->
							<div
								style:width="0"
								style:height="0"
								style:border-left="0.6em solid transparent"
								style:border-right="0.6em solid transparent"
								style:border-top="0.6em solid currentColor"
							/>
						</div>
						<section
							use:dndzone={{ items: answersIndexed, flipDurationMs: 100, dropTargetStyle: {} }}
							style:display="flex"
							style:flex-direction="column"
							style:gap="0.4em"
							style:flex="1"
							on:consider={handleConsider}
							on:finalize={handleFinalize}
						>
							{#each answersIndexed as { answer, id }, actualIndex (id)}
								<div
									style:display="flex"
									style:justify-content="space-between"
									style:align-items="center"
									style:gap="0.4em"
									animate:flip={{ duration: 300 }}
								>
									<div style:flex="1">
										<TextAnswerButton answerText={answer} index={id} correct={undefined} />
									</div>
									{#if actualIndex < answersIndexed.length - 1}
										<IconButton
											src={downArrow}
											alt="Move down"
											size="1.5em"
											on:click={() => {
												answersIndexed = [
													...answersIndexed.slice(0, actualIndex),
													answersIndexed[actualIndex + 1],
													answersIndexed[actualIndex],
													...answersIndexed.slice(actualIndex + 2)
												];
											}}
										/>
									{/if}
								</div>
							{/each}
						</section>
					</div>
					{#if axisLabels.to?.length}
						<div>{axisLabels.to}</div>
					{/if}
					<FancyButton
						on:click={() => {
							dispatch(
								'answer',
								answersIndexed.map(({ answer }) => answer)
							);
						}}
					>
						Submit
					</FancyButton>
				</div>
			</div>
		</NiceBackground>
	</div>
</div>
