<script lang="ts">
	import type { Slide } from '$lib';
	import MultipleChoiceSlideEditor from './MultipleChoiceSlideEditor.svelte';

	export let slide: Slide | undefined;
</script>

{#if slide === undefined}
	<div
		style:flex="1"
		style:display="flex"
		style:align-items="center"
		style:justify-content="center"
		style:text-align="center"
		style:font-size="xxx-large"
	>
		Add a Slide to See it Here!
	</div>
{:else if 'MultipleChoice' in slide}
	<MultipleChoiceSlideEditor bind:slide={slide.MultipleChoice} />
{/if}
