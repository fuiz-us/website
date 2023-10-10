<script lang="ts">
	import { buttonColors, type MultipleChoiceAnswer } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import Icon from '$lib/Icon.svelte';
	import variables from '$lib/assets/variables.svg';
	import Answer from './Answer.svelte';

	export let answers: MultipleChoiceAnswer[];
</script>

<div
	id="grid"
	style:display="grid"
	style="--count:{answers.length}"
	style:gap="5px"
	style:width="100%"
>
	{#each answers as answer, index}
		<Answer
			bind:answer
			{index}
			on:click={() => {
				answers.splice(index, 1);
				answers = answers;
			}}
		/>
	{/each}
	<div style:grid-column="1/ -1">
		<FancyButton
			backgroundColor={buttonColors.at(answers.length)?.[0]}
			backgroundDeepColor={buttonColors.at(answers.length)?.[1]}
			on:click={() => {
				answers.push({
					correct: false,
					content: {
						Text: ''
					}
				});
				answers = answers;
			}}
		>
			<div
				style:height="100%"
				style:text-align="center"
				style:font-size="clamp(1.25em,5vw,2em)"
				style:display="flex"
				style:align-items="center"
				style:justify-content="center"
				style:padding="5px 15px"
				style:gap="5px"
				style:box-sizing="border-box"
			>
				<Icon size="1.25em" src={variables} alt="add" />
				<div>Add Answer</div>
			</div>
		</FancyButton>
	</div>
</div>

<style>
	#grid {
		grid-template-columns: 1fr 1fr;
		grid-template-rows: repeat(calc(var(--count) / 2 + 1), 1fr);
	}

	@media only screen and (max-width: 600px) {
		#grid {
			grid-template-columns: 1fr;
			grid-template-rows: repeat(calc(var(--count) + 1), 1fr);
		}
	}
</style>
