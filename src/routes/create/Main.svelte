<script lang="ts">
	import type { FuizConfig } from '$lib/types';
	import OptionsBar from './OptionsBar.svelte';
	import Sidebar from './Sidebar.svelte';
	import SlideEditor from './SlideEditor.svelte';

	export let config: FuizConfig;

	let selectedSlideIndex = 0;

	$: activeSlide = config.slides.at(selectedSlideIndex);
</script>

<div
	id="editor"
	style:display="flex"
	style:flex="1"
	style:align-items="stretch"
	style:background="var(--background-color)"
>
	<Sidebar bind:slides={config.slides} bind:selectedSlideIndex />
	<div style:flex="1" style:display="flex" style:flex-direction="column">
		<SlideEditor bind:slide={activeSlide} />
	</div>
	{#if activeSlide}
		<OptionsBar bind:activeSlide />
	{/if}
</div>

<style>
	#editor {
		flex-direction: row;
	}

	@media only screen and (max-width: 900px) {
		#editor {
			flex-direction: column-reverse;
		}
	}
</style>
