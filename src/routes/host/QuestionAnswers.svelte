<script lang="ts">
	import AnsweredCount from '$lib/Game/AnsweredCount.svelte';
	import think from '$lib/assets/kevin_macleod_thinking_music.mp3';
	import Answers from '$lib/Game/Answers.svelte';
	import MediaContainer from '$lib/MediaContainer.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import TimeLeft from '$lib/Game/TimeLeft.svelte';
	import VerticalTripleSplit from '$lib/VerticalTripleSplit.svelte';
	import Topbar from './Topbar.svelte';
	import type { Media } from '$lib';
	import TextBar from '$lib/Game/TextBar.svelte';
	import Audio from '$lib/Audio.svelte';

	export let questionIndex: number;
	export let questionTotalCount: number;
	export let gameId: string;
	export let questionText: string;
	export let answers: string[];
	export let timeLeft: number;
	export let timeStarted: number;
	export let answeredCount: number;
	export let media: Media | undefined;
	export let volume_on: boolean;

	let fullscreenElement;
</script>

<Audio audioUrl={think} volumeOn={volume_on} />
<div
	bind:this={fullscreenElement}
	style:height="100%"
	style:display="flex"
	style:flex-direction="column"
>
	<Topbar
		bind:volume_on
		on:next
		{questionIndex}
		{fullscreenElement}
		{questionTotalCount}
		{gameId}
		show_skip={true}
	/>
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
						<TimeLeft {timeLeft} {timeStarted} />
						<AnsweredCount {answeredCount} />
					</div>
				</svelte:fragment>
				<svelte:fragment slot="center">
					<MediaContainer {media} showFallback={false} />
				</svelte:fragment>
				<svelte:fragment slot="bottom">
					<Answers
						answers={answers.map((a) => {
							return { text: a, correct: undefined };
						})}
					/>
				</svelte:fragment>
			</VerticalTripleSplit>
		</NiceBackground>
	</div>
</div>
