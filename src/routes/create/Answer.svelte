<script lang="ts">
	import { buttonColors, type MultipleChoiceAnswer } from '$lib';
	import Checkbox from '$lib/Checkbox.svelte';
	import delete_answer from '$lib/assets/delete.svg';
	import FancyButton from '$lib/FancyButton.svelte';
	import Textbox from '$lib/Textbox.svelte';
	import Icon from '$lib/Icon.svelte';

	export let answer: MultipleChoiceAnswer;
	export let index: number;
</script>

<FancyButton
	backgroundColor={buttonColors.at(index)?.[0]}
	backgroundDeepColor={buttonColors.at(index)?.[1]}
	active={false}
>
	<div
		style:font-size="max(1.25em,min(2em,5vw))"
		style:display="flex"
		style:align-items="center"
		style:padding="5px 10px"
		style:gap="10px"
		style:color="white"
	>
		<div style:height="1.5em" style:display="flex">
			<Checkbox bind:value={answer.correct} color={buttonColors.at(index)?.[0]} />
		</div>
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
			style:padding="0"
			style:background="none"
			style:cursor="pointer"
			style:color="inherit"
			on:click
		>
			<Icon size="100%" src={delete_answer} alt="delete anaswer" />
		</button>
	</div>
</FancyButton>
