<script lang="ts">
	import { type Slide } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import { flip } from 'svelte/animate';
	import left from '$lib/assets/left.svg';
	import right from '$lib/assets/right.svg';
	import first from '$lib/assets/first.svg';
	import last from '$lib/assets/last.svg';
	import Thumbnail from './Thumbnail.svelte';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import add_slide from '$lib/assets/add_slide.svg';
	import Icon from '$lib/Icon.svelte';
	import IconButton from '$lib/IconButton.svelte';
	import { tick } from 'svelte';

	export let slides: Slide[];
	export let selected_slide_index: number;

	async function handleConsider(e: CustomEvent<DndEvent<Slide>>) {
		const id = slides.at(selected_slide_index)?.id ?? 0;
		console.log(slides);
		slides = e.detail.items;
		const new_index = e.detail.items.findIndex((s) => s.id == id);
		selected_slide_index =
			new_index === -1
				? e.detail.items.findIndex((s) => s.id.toString().startsWith('id'))
				: new_index;
	}

	async function handleFinalize(e: CustomEvent<DndEvent<Slide>>) {
		const id = slides.at(selected_slide_index)?.id ?? 0;

		slides = e.detail.items;

		if (id.toString().startsWith('id')) {
			selected_slide_index = e.detail.items.findIndex(
				(s) => s.id.toString() == e.detail.info.id.toString()
			);
		}
	}

	let section: HTMLElement;

	async function changeSelected(new_value: number) {
		let clamped = Math.min(Math.max(0, new_value), slides.length - 1);
		selected_slide_index = clamped;
		await tick();
		let selected_slide = document.querySelector(`#slide_${clamped}`);
		if (selected_slide) {
			let selected_rect = selected_slide.getBoundingClientRect();
			let parent_rect = section.getBoundingClientRect();
			section.scrollTo({
				top: section.scrollTop + selected_rect.y - parent_rect.y,
				left: section.scrollLeft + selected_rect.x - parent_rect.x
			});
		}
	}
</script>

<div
	id="sidebar"
	style:padding="0.4em"
	style:display="flex"
	style:flex-direction="column"
	style:gap="0.4em"
>
	<div
		class="switched"
		style:flex="1"
		style:display="flex"
		style:align-items="stretch"
		style:justify-content="space-between"
		style:gap="0.4em"
		style:box-sizing="border-box"
	>
		<div style:flex="1" style:flex-direction="column" style:box-sizing="border-box">
			<section
				bind:this={section}
				use:dndzone={{ items: slides, flipDurationMs: 100, dropTargetStyle: {} }}
				class="switched"
				style:display="flex"
				style:width="0"
				style:min-height="100%"
				style:min-width="100%"
				style:gap="0.2em"
				style:overflow="auto"
				on:consider={handleConsider}
				on:finalize={handleFinalize}
			>
				{#each slides as slide, index (slide.id)}
					<div
						id="slide_{index}"
						style:padding="0.4em"
						style:box-sizing="border-box"
						style:height="fit-content"
						animate:flip={{ duration: 300 }}
					>
						<Thumbnail
							{slide}
							{index}
							selected={index === selected_slide_index}
							on:select={() => changeSelected(index)}
							on:delete={async () => {
								slides.splice(index, 1);
								if (index <= selected_slide_index) {
									await changeSelected(selected_slide_index - 1);
								}
								slides = slides;
							}}
							on:duplicate={async () => {
								let same_slide = structuredClone(slide);
								same_slide.id = Date.now();
								slides.splice(index + 1, 0, same_slide);
								slides = slides;
								await changeSelected(selected_slide_index + 1);
							}}
						/>
					</div>
				{/each}
			</section>
		</div>
		<div>
			<FancyButton
				on:click={async () => {
					slides.push({
						MultipleChoice: {
							title: '',
							media: undefined,
							introduce_question: 3,
							time_limit: 30,
							points_awarded: 1000,
							answers: []
						},
						id: Date.now()
					});
					slides = slides;
					await changeSelected(slides.length - 1);
				}}
			>
				<div
					style:padding="0.2em 0.4em"
					style:height="100%"
					style:box-sizing="border-box"
					style:display="flex"
					style:align-items="center"
					style:justify-content="center"
					style:gap="0.2em"
				>
					<Icon size="1em" src={add_slide} alt="add slide" />
					<div class="would-be-hidden">Add Slide</div>
				</div>
			</FancyButton>
		</div>
	</div>
	<div id="controls" style:justify-content="center" style:align-items="center" style:gap="5px">
		<div style:background="#00000020" style:border-radius="0.2em">
			<IconButton
				src={first}
				alt="Go to First Page"
				size="1.2em"
				padding="0.2em"
				on:click={() => changeSelected(0)}
			/>
		</div>
		<div style:background="#00000020" style:border-radius="0.2em">
			<IconButton
				src={left}
				alt="Go to Left"
				size="1.2em"
				padding="0.2em"
				on:click={() => changeSelected(selected_slide_index - 1)}
			/>
		</div>
		<div style:background="#00000020" style:border-radius="0.2em">
			<div
				style:height="1.2em"
				style:aspect-ratio="1/1"
				style:padding="0.2em"
				style:text-align="center"
				style:font-weight="bold"
			>
				{selected_slide_index + 1}
			</div>
		</div>
		<div style:background="#00000020" style:border-radius="0.2em">
			<IconButton
				src={right}
				alt="Go Right"
				size="1.2em"
				padding="0.2em"
				on:click={() => changeSelected(selected_slide_index + 1)}
			/>
		</div>
		<div style:background="#00000020" style:border-radius="0.2em">
			<IconButton
				src={last}
				alt="Go to Last Page"
				size="1.2em"
				padding="0.2em"
				on:click={() => changeSelected(slides.length - 1)}
			/>
		</div>
	</div>
</div>

<style>
	#sidebar {
		width: 8em;
	}

	.switched {
		flex-direction: column;
	}

	#controls {
		display: none;
	}

	section {
		height: 0;
	}

	@media only screen and (max-width: 600px) {
		section {
			height: unset;
		}

		#controls {
			display: flex;
		}

		#sidebar {
			width: unset;
			height: unset;
			border-top: 0.15em solid #00000020;
		}
		.switched {
			flex-direction: row;
			width: unset;
			height: unset;
		}

		.would-be-hidden {
			display: none;
		}
	}
</style>
