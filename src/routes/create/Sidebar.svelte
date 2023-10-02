<script lang="ts">
	import type { Slide } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import { flip } from 'svelte/animate';
	import Thumbnail from './Thumbnail.svelte';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import add_slide from '$lib/assets/add_slide.svg';

	export let slides: Slide[];
	export let selected_slide_index: number;

	function handleConsider(e: CustomEvent<DndEvent<Slide>>) {
		slides = e.detail.items;
		selected_slide_index = slides.findIndex((s) => s.id.toString().startsWith('id'));
	}

	function handleFinalize(e: CustomEvent<DndEvent<Slide>>) {
		slides = e.detail.items;
		selected_slide_index = slides.findIndex((s) => s.id.toString() === e.detail.info.id.toString());
	}
</script>

<div
	style:display="flex"
	style:flex-direction="column"
	style:justify-content="space-between"
	style:padding="10px"
	style:gap="10px"
	style:box-sizing="border-box"
	style:height="100%"
	style:width="300px"
	style:background="#eee"
>
	<section
		use:dndzone={{ items: slides, flipDurationMs: 300, dropTargetStyle: {} }}
		style:display="flex"
		style:flex-direction="column"
		style:flex="1"
		style:gap="5px"
		style:overflow="auto"
		on:consider={handleConsider}
		on:finalize={handleFinalize}
	>
		{#each slides as slide, index (slide.id)}
			<div style:margin="10px" animate:flip={{ duration: 300 }}>
				<Thumbnail
					{slide}
					{index}
					selected={index === selected_slide_index}
					on:select={() => (selected_slide_index = index)}
					on:delete={() => {
						slides.splice(index, 1);
						if (index <= selected_slide_index) {
							selected_slide_index = Math.max(0, selected_slide_index - 1);
						}
						slides = slides;
					}}
					on:duplicate={() => {
						let same_slide = structuredClone(slide);
						same_slide.id = Date.now();
						slides.splice(index + 1, 0, same_slide);
						selected_slide_index = index + 1;
						slides = slides;
					}}
				/>
			</div>
		{/each}
	</section>
	<div>
		<FancyButton
			on:click={() => {
				slides.push({
					MultipleChoice: {
						title: '',
						media: undefined,
						introduce_question: 5,
						time_limit: 30,
						points_awarded: 1000,
						answers: []
					},
					id: Date.now()
				});
				slides = slides;
				selected_slide_index = slides.length - 1;
			}}
		>
			<div
				style:padding="5px 10px"
				style:font-size="x-large"
				style:display="flex"
				style:align-items="center"
				style:justify-content="center"
				style:gap="5px"
			>
				<img
					src={add_slide}
					style:height="1em"
					style:width="1em"
					alt="add"
					style:display="flex"
					style:filter="invert(1)"
				/>
				<div>Add Slide</div>
			</div>
		</FancyButton>
	</div>
</div>
