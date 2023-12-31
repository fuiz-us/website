<script lang="ts">
	import { buttonColors, limits, type TextOrMedia } from '$lib';
	import Checkbox from '$lib/Checkbox.svelte';
	import deleteAnswer from '$lib/assets/delete.svg';
	import FancyButton from '$lib/FancyButton.svelte';
	import Textbox from '$lib/Textbox.svelte';
	import Icon from '$lib/Icon.svelte';

	export let correct: boolean;
	export let content: TextOrMedia;
	export let index: number;
</script>

<FancyButton
	backgroundColor={buttonColors.at(index % buttonColors.length)?.[0]}
	backgroundDeepColor={buttonColors.at(index % buttonColors.length)?.[1]}
	active={false}
>
	<div
		style:display="flex"
		style:align-items="center"
		style:padding="0.15em 0.3em"
		style:gap="0.3em"
		style:color="var(--palette-light)"
	>
		<div style:height="1.5em" style:display="flex">
			<Checkbox bind:value={correct} color={buttonColors.at(index % buttonColors.length)?.[0]} />
		</div>
		<Textbox
			bind:value={content.Text}
			placeholder="Answer Text"
			textAlign="start"
			lightText
			maxLength={limits.fuiz.maxAnswerTextLength}
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
			<Icon size="100%" src={deleteAnswer} alt="delete anaswer" />
		</button>
	</div>
</FancyButton>
