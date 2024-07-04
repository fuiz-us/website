<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import { limits } from '$lib';
	import Textarea from '$lib/Textarea.svelte';
	import Answers from './Answers.svelte';
	import MediaChooser from './MediaChooser.svelte';
	import type { MultipleChoiceSlide } from '$lib/types';

	export let slide: MultipleChoiceSlide;

	if (slide.time_limit < 1000) slide.time_limit *= 1000;
	if (slide.introduce_question < 1000) slide.introduce_question *= 1000;
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
			maxLength={limits.fuiz.multipleChoice.maxTitleLength}
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
	<Answers bind:answers={slide.answers} />
</div>
