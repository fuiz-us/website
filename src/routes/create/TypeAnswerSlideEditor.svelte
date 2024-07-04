<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import { limits } from '$lib';
	import Textarea from '$lib/Textarea.svelte';
	import MediaChooser from './MediaChooser.svelte';
	import deleteAnswer from '$lib/assets/delete.svg';
	import type { TypeAnswer } from '$lib/types';
	import Textfield from '$lib/Textfield.svelte';
	import FancyButton from '$lib/FancyButton.svelte';
	import IconButton from '$lib/IconButton.svelte';

	export let slide: TypeAnswer;

	if (slide.time_limit < 1000) slide.time_limit *= 1000;
</script>

<div
	style:flex="1"
	style:display="flex"
	style:flex-direction="column"
	style:gap="0.2em"
	style:padding="0.6em 0.4em 0.4em"
	style:align-items="center"
	style:justify-content="space-between"
>
	<div style:max-width="25ch" style:width="100%" style:padding-top="0.5em" style:overflow="auto">
		<Textarea
			bind:value={slide.title}
			placeholder={m.question_text()}
			id="question_title"
			required={false}
			disabled={false}
			maxHeight="4em"
			maxLength={limits.fuiz.typeAnswer.maxTitleLength}
		/>
	</div>
	<div
		style:display="flex"
		style:width="100%"
		style:flex-wrap="wrap-reverse"
		style:gap="0.2em"
		style:align-items="center"
		style:justify-content="center"
	>
		<MediaChooser bind:media={slide.media} />
	</div>
	<div style:display="flex" style:flex-direction="column" style:gap="0.4em" style:width="20ch">
		{#each slide.answers as answer}
			<div
				style:display="flex"
				style:gap="0.2em"
				style:align-items="center"
				style:justify-content="center"
			>
				<Textfield
					bind:value={answer.text}
					placeholder={m.answer_text()}
					id="answer_text"
					required={false}
					disabled={false}
					maxLength={limits.fuiz.maxAnswerTextLength}
				/>
				<IconButton
					src={deleteAnswer}
					size="1.5em"
					alt={m.delete_answer()}
					on:click={() => (slide.answers = slide.answers.filter((a) => a.id !== answer.id))}
				/>
			</div>
		{/each}
		{#if slide.answers.length < limits.fuiz.typeAnswer.maxAnswerCount}
			<FancyButton
				on:click={() => (slide.answers = [...slide.answers, { text: '', id: Date.now() }])}
			>
				{m.add_answer()}
			</FancyButton>
		{/if}
	</div>
</div>
