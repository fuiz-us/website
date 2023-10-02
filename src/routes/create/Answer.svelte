<script lang="ts">
	import { buttonColors, type MultipleChoiceAnswer } from '$lib';
	import Checkbox from '$lib/Checkbox.svelte';
	import delete_answer from '$lib/assets/delete.svg';
	import FancyButton from '$lib/FancyButton.svelte';
	import Textbox from '$lib/Textbox.svelte';

	export let answer: MultipleChoiceAnswer;
	export let index: number;
</script>

<FancyButton
	backgroundColor={buttonColors.at(index)?.[0]}
	backgroundDeepColor={buttonColors.at(index)?.[1]}
	active={false}
>
	<div
		style:font-size="xx-large"
		style:display="flex"
		style:align-items="center"
		style:padding="5px 10px"
		style:gap="10px"
		style:color="white"
	>
		<Checkbox bind:value={answer.correct} color={buttonColors.at(index)?.[0]} />
		<Textbox
			bind:value={answer.content.Text}
			placeholder="Answer Text"
			textAlign="start"
			lightText
		/>
		<button
			style:font="inherit"
			style:display="flex"
			style:height="1.25em"
			style:aspect-ratio="1/1"
			style:appearance="none"
			style:border="none"
			style:background="none"
			style:cursor="pointer"
			on:click
		>
			<img
				height="100%"
				width="100%"
				style:display="flex"
				src={delete_answer}
				style:filter="invert(1)"
				alt="delete answer"
			/>
		</button>
	</div>
</FancyButton>
