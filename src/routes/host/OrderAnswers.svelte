<script lang="ts">
	import AnsweredCount from '$lib/Game/AnsweredCount.svelte';
	import think from '$lib/assets/kevin_macleod_thinking_music.mp3';
	import MediaContainer from '$lib/MediaContainer.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import TimeLeft from '$lib/Game/TimeLeft.svelte';
	import VerticalTripleSplit from '$lib/Game/VerticalTripleSplit.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';
	import Audio from '$lib/Audio.svelte';
	import type { BindableGameInfo, SharedGameInfo } from './+page';
	import type { Media } from '$lib/types';
	import TextAnswerButton from '$lib/Game/TextAnswerButton.svelte';

	export let bindableGameInfo: BindableGameInfo;
	export let gameInfo: SharedGameInfo;

	export let questionText: string;
	export let axis_labels: { from: string; to: string };
	export let answers: string[];
	export let timeLeft: number | undefined;
	export let timeStarted: number | undefined;
	export let answeredCount: number;
	export let media: Media | undefined;

	let fullscreenElement;
</script>

<Audio audioUrl={think} volumeOn={bindableGameInfo.volumeOn} />
<div
	bind:this={fullscreenElement}
	style:height="100%"
	style:display="flex"
	style:flex-direction="column"
>
	<Topbar bind:bindableGameInfo {gameInfo} on:lock on:next {fullscreenElement} showSkip={true} />
	<TextBar text={questionText} />
	<div style:flex="1">
		<NiceBackground>
			<VerticalTripleSplit>
				<svelte:fragment slot="top">
					<div
						style:display="flex"
						style:justify-content="space-between"
						style:z-index="1"
						style:padding="0.4em"
					>
						{#if timeLeft !== undefined && timeStarted !== undefined}
							<TimeLeft {timeLeft} {timeStarted} />
						{/if}
						<AnsweredCount {answeredCount} />
					</div>
				</svelte:fragment>
				<svelte:fragment slot="center">
					<MediaContainer {media} showFallback={false} />
				</svelte:fragment>
				<svelte:fragment slot="bottom">
					<div
						style:display="flex"
						style:flex-direction="column"
						style:justify-content="center"
						style:gap="0.4em"
						style:padding="1em"
					>
						{#if axis_labels.from.length}
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
						{#if axis_labels.to.length}
							<div>{axis_labels.to}</div>
						{/if}
					</div>
				</svelte:fragment>
			</VerticalTripleSplit>
		</NiceBackground>
	</div>
</div>
