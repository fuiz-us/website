<script lang="ts">
	import type { MultipleChoiceSlide } from '$lib';
	import Icon from '$lib/Icon.svelte';
	import SelectTime from '$lib/SelectTime.svelte';
	import Textarea from '$lib/Textarea.svelte';
	import timer from '$lib/assets/timer.svg';
	import Answers from './Answers.svelte';
	import MediaChooser from './MediaChooser.svelte';

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
			placeholder="Question Title"
			id="question_title"
			required={false}
			disabled={false}
			max_height="4em"
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
			<SelectTime options={[5, 10, 30, 60, 120, 240]} bind:selected={slide.time_limit}>
				<Icon src={timer} size="1em" alt="Time Limit" />
			</SelectTime>
		</div>
		<MediaChooser bind:media={slide.media} />
	</div>
	<Answers bind:answers={slide.answers} />
</div>
