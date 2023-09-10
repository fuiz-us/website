<script lang="ts">
	import Answers from '$lib/Game/Answers.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import QuestionText from '$lib/Game/QuestionText.svelte';
	import Statistics from '$lib/Game/Statistics.svelte';
	import TimeLeft from '$lib/Game/TimeLeft.svelte';
	import VerticalSplit from '$lib/VerticalSplit.svelte';
	import Topbar from './Topbar.svelte';

	export let questionIndex: number;
	export let questionTotalCount: number;
	export let gameId: string;
	export let questionText: string;
	export let answers: { text: string; count: number; correct: boolean }[];
	export let timeLeft: number | undefined = undefined;
</script>

<div style:height="100%" style:display="flex" style:flex-direction="column">
	<Topbar {questionIndex} {questionTotalCount} {gameId} />
	<QuestionText on:next {questionText} show_next={true} />
	<div style:flex="1">
		<NiceBackground>
			<VerticalSplit>
				<svelte:fragment slot="top">
					{#if timeLeft !== undefined}
						<TimeLeft {timeLeft} />
					{/if}
					<Statistics
						statistics={answers.map(({ count, correct }) => {
							return { count, correct };
						})}
					/>
				</svelte:fragment>
				<svelte:fragment slot="bottom">
					<Answers {answers} />
				</svelte:fragment>
			</VerticalSplit>
		</NiceBackground>
	</div>
</div>
