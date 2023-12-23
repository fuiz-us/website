<script lang="ts">
	import type { Slide } from '$lib';
	import Icon from '$lib/Icon.svelte';
	import ghost from '$lib/assets/ghost.svg';
	import MultipleChoiceSlideEditor from './MultipleChoiceSlideEditor.svelte';

	export let slide: Slide | undefined;
</script>

{#if slide === undefined}
	<div
		style:flex="1"
		style:display="flex"
		style:flex-direction="column"
		style:align-items="center"
		style:justify-content="center"
		style:text-align="center"
		style:font-size="2em"
		style:opacity="0.4"
	>
		<Icon src={ghost} size="min(30vh, 60vw)" alt="Nothing Here" />
		No Slides
	</div>
{:else if 'MultipleChoice' in slide}
	<MultipleChoiceSlideEditor bind:slide={slide.MultipleChoice} />
{/if}
