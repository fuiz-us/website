<script lang="ts">
	import * as m from '$paraglide/messages';

	import { limits } from '$lib';
	import Icon from '$lib/Icon.svelte';
	import SelectTime from '$lib/SelectTime.svelte';
	import Textarea from '$lib/Textarea.svelte';
	import timer from '$lib/assets/timer.svg';
	import Answers from './Answers.svelte';
	import MediaChooser from './MediaChooser.svelte';
	import type { MultipleChoiceSlide } from '$lib/types';

	export let slide: MultipleChoiceSlide;
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
			maxLength={limits.fuiz.maxTitleLength}
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
		<div>
			<SelectTime
				options={[...limits.fuiz.multipleChoice.allowedTimeLimits]}
				bind:selected={slide.time_limit}
			>
				<Icon src={timer} size="1em" alt={m.time_limit()} />
			</SelectTime>
		</div>
		<MediaChooser bind:media={slide.media} />
	</div>
	<Answers bind:answers={slide.answers} />
</div>
