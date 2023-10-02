<script lang="ts">
	import { buttonColors, type MultipleChoiceAnswer } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import variables from '$lib/assets/variables.svg';
	import Answer from './Answer.svelte';

	export let answers: MultipleChoiceAnswer[];
</script>

<div
	style:display="grid"
	style:grid-template-columns="1fr 1fr"
	style:grid-template-rows="repeat({Math.ceil(answers.length / 2 + 1)}, 1fr)"
	style:gap="5px"
	style:width="100%"
	style:padding="5px"
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
				style:font-size="xx-large"
				style:display="flex"
				style:align-items="center"
				style:justify-content="center"
				style:padding="5px 15px"
				style:gap="5px"
				style:box-sizing="border-box"
			>
				<img
					src={variables}
					style:height="1.25em"
					style:width="1.25em"
					alt="add"
					style:display="flex"
					style:filter="invert(1)"
				/>
				<div>Add Answer</div>
			</div>
		</FancyButton>
	</div>
</div>
