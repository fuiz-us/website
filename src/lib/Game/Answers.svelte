<script lang="ts">
	import TextAnswerButton from './TextAnswerButton.svelte';

	export let answers: { text: string; correct: boolean | undefined }[];
</script>

<div id="container">
	<div id="inner" style:display="grid" style:gap="0.2em" style:padding="0.2em">
		{#each answers as answer, index}
			<TextAnswerButton {index} answerText={answer.text} correct={answer.correct} />
		{/each}
	</div>
</div>

<style>
	#container {
		container-type: inline-size;
	}
	#inner {
		grid-template-columns: 1fr 1fr;
	}

	@container (width <= 40ch) {
		#inner {
			grid-template-columns: 1fr;
		}
	}
</style>
