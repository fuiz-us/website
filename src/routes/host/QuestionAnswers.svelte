<script lang="ts">
	import AnsweredCount from '$lib/Game/AnsweredCount.svelte';
	import think from '$lib/assets/kevin_macleod_thinking_music.mp3';
	import Answers from '$lib/Game/Answers.svelte';
	import MediaContainer from '$lib/MediaContainer.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import QuestionText from '$lib/Game/QuestionText.svelte';
	import TimeLeft from '$lib/Game/TimeLeft.svelte';
	import VerticalSplit from '$lib/VerticalSplit.svelte';
	import Topbar from './Topbar.svelte';
	import type { Media } from '$lib';
	import { onMount } from 'svelte';

	export let questionIndex: number;
	export let questionTotalCount: number;
	export let gameId: string;
	export let questionText: string;
	export let answers: string[];
	export let timeLeft: number;
	export let answeredCount: number;
	export let media: Media | null;
	export let volume_on: boolean;

	const audio = new Audio(think);
	audio.loop = true;
	$: audio.volume = volume_on ? 1.0 : 0.0;

	onMount(() => {
		audio.play();
		return () => {
			audio.pause();
		};
	});
</script>

<div style:height="100%" style:display="flex" style:flex-direction="column">
	<Topbar bind:volume_on on:next {questionIndex} {questionTotalCount} {gameId} show_skip={true} />
	<QuestionText {questionText} fontSize="48px" />
	<div style:flex="1">
		<NiceBackground>
			<VerticalSplit>
				<svelte:fragment slot="top">
					<TimeLeft {timeLeft} />
					<MediaContainer {media} />
					<AnsweredCount {answeredCount} />
				</svelte:fragment>
				<svelte:fragment slot="bottom">
					<Answers
						answers={answers.map((a) => {
							return { text: a, correct: undefined };
						})}
					/>
				</svelte:fragment>
			</VerticalSplit>
		</NiceBackground>
	</div>
</div>
