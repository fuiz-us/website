<script lang="ts">
	import type { MultipleChoiceSlide } from '$lib';
	import Numberbox from '$lib/Numberbox.svelte';
	import Textbox from '$lib/Textbox.svelte';
	import Answers from './Answers.svelte';
	import MediaChooser from './MediaChooser.svelte';

	export let slide: MultipleChoiceSlide;

	let numberboxElement: HTMLDivElement;
</script>

<div
	style:flex="1"
	style:display="flex"
	style:flex-direction="column"
	style:gap="5px"
	style:padding="20px 10px 10px"
	style:align-items="center"
	style:background="#00000008"
	style:justify-content="space-between"
>
	<div
		class="focus-within"
		style:max-width="30ch"
		style:font-size="clamp(1.25em,8vw,2em)"
		style:box-shadow="0 0 4px #000000C0"
		style:background="white"
		style:max-height="200px"
		style:border-radius="5px"
		style:overflow="auto"
	>
		<Textbox bind:value={slide.title} placeholder="Question Title" />
	</div>
	<div
		style:display="flex"
		style:width="100%"
		style:gap="5px"
		style:align-items="center"
		style:justify-content="space-between"
	>
		<div
			class="focus-within"
			bind:this={numberboxElement}
			style:font-size="clamp(1.25em,6vw,2em)"
			style:height="2.5em"
			style:width="2.5em"
			style:border-radius="100%"
			style:box-shadow="0 0px 4px #00000080"
			style:background="white"
		>
			<Numberbox min={1} max={120} bind:value={slide.time_limit} />
		</div>
		<MediaChooser bind:media={slide.media} />
	</div>
	<Answers bind:answers={slide.answers} />
</div>

<style>
	.focus-within:focus-within {
		outline: 2px solid blueviolet;
	}
</style>
