<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import TextAnswerButton from './TextAnswerButton.svelte';

	export let answers: { text: string; correct: boolean | undefined }[];

	const dispatch = createEventDispatcher<{
		answer: number;
	}>();
</script>

<div id="container">
	<div id="inner">
		{#each answers as answer, index}
			<TextAnswerButton
				{index}
				answerText={answer.text}
				correct={answer.correct}
				on:click={() => {
					dispatch('answer', index);
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
