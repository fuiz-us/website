<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';
	import factual from '$lib/assets/correct.svg';
	import type { BindableGameInfo, SharedGameInfo } from './+page';
	import type { Media } from '$lib/types';
	import TextAnswerButton from '$lib/Game/TextAnswerButton.svelte';
	import Icon from '$lib/Icon.svelte';
	import wrong from '$lib/assets/wrong.svg';
	import VerticalSplit from '$lib/Game/VerticalSplit.svelte';

	export let bindableGameInfo: BindableGameInfo;
	export let gameInfo: SharedGameInfo;

	export let questionText: string;
	export let axis_labels: { from: string; to: string };
	export let answers: string[];
	export let results: [number, number];
	export let media: Media | undefined;

	let fullscreenElement;
</script>

<div
	bind:this={fullscreenElement}
	style:height="100%"
	style:display="flex"
	style:flex-direction="column"
>
	<Topbar bind:bindableGameInfo {gameInfo} on:lock {fullscreenElement} />
	<TextBar text={questionText} showNext={true} on:next />
	<div style:flex="1">
		<NiceBackground>
			<VerticalSplit>
				<svelte:fragment slot="top">
					<div
						style:display="flex"
						style:justify-content="center"
						style:align-items="center"
						style:font-size="2.5em"
						style:gap="1em"
						style:padding="0.2em"
					>
						<div
							style:display="inline-flex"
							style:font-family="Poppins"
							style:align-items="center"
							style:gap="0.2em"
						>
							{results[0]}
							<Icon src={factual} alt={m.correct()} size="1.25em" />
						</div>
						<div
							style:display="inline-flex"
							style:font-family="Poppins"
							style:align-items="center"
							style:gap="0.2em"
						>
							{results[1]}
							<Icon src={wrong} alt={m.wrong()} size="1.25em" />
						</div>
					</div>
				</svelte:fragment>
				<svelte:fragment slot="bottom">
					<div
						style:display="flex"
						style:flex-direction="column"
						style:justify-content="center"
						style:gap="0.4em"
						style:padding="1em"
					>
						{#if axis_labels.from}
							<div>{axis_labels.from}</div>
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
							<div
								style:display="flex"
								style:flex-direction="column"
								style:gap="0.4em"
								style:flex="1"
							>
								{#each answers as answer, index}
									<TextAnswerButton answerText={answer} {index} correct={undefined} />
								{/each}
							</div>
						</div>
						{#if axis_labels.to}
							<div>{axis_labels.to}</div>
						{/if}
					</div>
				</svelte:fragment>
			</VerticalSplit>
		</NiceBackground>
	</div>
</div>
