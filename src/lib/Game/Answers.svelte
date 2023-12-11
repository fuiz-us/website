<script lang="ts">
	import TextAnswerButton from './TextAnswerButton.svelte';

	export let answers: { text: string; correct: boolean | undefined }[];
</script>

<div
	style:display="grid"
	style:--count={Math.ceil(answers.length / 2)}
	style:gap="5px"
	style:padding="5px"
>
	{#each answers as answer, index}
		<TextAnswerButton {index} answerText={answer.text} correct={answer.correct} />
	{/each}
</div>

<style>
	div {
		grid-template-columns: 1fr 1fr;
		grid-template-rows: repeat(var(--count), 1fr);
	}

	@media (max-width: 600px) {
		div {
			grid-template-columns: 1fr;
			grid-template-rows: repeat(auto-fill, 1fr);
		}
	}
</style>
