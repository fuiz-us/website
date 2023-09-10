<script lang="ts">
	import TextAnswerButton from './TextAnswerButton.svelte';

	export let answers: { text: string; correct: boolean | undefined }[];
</script>

<div
	style:display="grid"
	style:grid-template-columns="1fr 1fr"
	style:grid-template-rows="repeat({Math.ceil(answers.length / 2)}, 1fr)"
	style:gap="5px"
	style:padding="5px"
>
	{#each answers as answer, index}
		<TextAnswerButton {index} answerText={answer.text} correct={answer.correct} />
	{/each}
</div>
