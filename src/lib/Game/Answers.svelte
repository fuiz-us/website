<script lang="ts">
	import TextAnswerButton from './TextAnswerButton.svelte';
	import EmptyAnswerButton from './EmptyAnswerButton.svelte';

	interface Props {
		answers: { text: string | undefined; correct: boolean | undefined }[];
		onanswer?: (index: number) => void;
	}

	let { answers, onanswer }: Props = $props();

	type knownAnswer = { index: number; text: string; correct: boolean | undefined };
	type unknownAnswer = { index: number; correct: boolean | undefined };

	function filterAnswers(answers: { text: string | undefined; correct: boolean | undefined }[]): {
		knownAnswers: knownAnswer[];
		unknownAnswers: unknownAnswer[];
	} {
		let knownAnswers: knownAnswer[] = [];
		let unknownAnswers: unknownAnswer[] = [];
		answers.forEach(({ text, correct }, index) => {
			if (text) {
				knownAnswers.push({
					index,
					text,
					correct
				});
			} else {
				unknownAnswers.push({
					index,
					correct
				});
			}
		});
		return {
			unknownAnswers,
			knownAnswers
		};
	}

	let answersFiltered = $derived(filterAnswers(answers));
</script>

<div id="container">
	<div id="inner">
		{#each answersFiltered.knownAnswers as answer}
			<TextAnswerButton
				index={answer.index}
				answerText={answer.text}
				correct={answer.correct}
				onclick={() => {
					if (onanswer) onanswer(answer.index);
				}}
			/>
		{/each}
		{#each answersFiltered.unknownAnswers as { index }}
			<EmptyAnswerButton
				{index}
				onclick={() => {
					if (onanswer) onanswer(index);
				}}
			/>
		{/each}
	</div>
</div>

<style>
	#container {
		container-type: inline-size;
		height: 100%;
	}

	#inner {
		grid-template-columns: 1fr 1fr;
		height: 100%;
		display: grid;
		gap: 0.2em;
		padding: 0.2em;
		box-sizing: border-box;
	}

	@container (width <= 40ch) {
		#inner {
			grid-template-columns: 1fr;
		}
	}
</style>
