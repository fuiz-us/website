<script lang="ts">
	import * as m from '$paraglide/messages';

	import { limits } from '$lib';
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
	import type { Slide } from '$lib/types';

	export let slides: Slide[];
	export let selectedSlideIndex: number;

	async function handleConsider(e: CustomEvent<DndEvent<Slide>>) {
		const id = slides.at(selectedSlideIndex)?.id ?? 0;
		slides = e.detail.items;
		const newIndex = e.detail.items.findIndex((s) => s.id == id);
		selectedSlideIndex =
			newIndex === -1
				? e.detail.items.findIndex((s) => s.id.toString().startsWith('id'))
				: newIndex;
	}

	async function handleFinalize(e: CustomEvent<DndEvent<Slide>>) {
		const id = slides.at(selectedSlideIndex)?.id ?? 0;

		slides = e.detail.items;

		if (id.toString().startsWith('id')) {
			selectedSlideIndex = e.detail.items.findIndex(
				(s) => s.id.toString() == e.detail.info.id.toString()
			);
		}
	}

	let section: HTMLElement;

	function clamp(min: number, value: number, max: number): number {
		return Math.min(max, Math.max(value, min));
	}

	async function changeSelected(newValue: number) {
		const clamped = Math.min(Math.max(0, newValue), slides.length - 1);
		selectedSlideIndex = clamped;

		await tick();

		const selectedSlide = document.querySelector(`#slide_${clamped}`);
		if (!selectedSlide) return;

		const selectedRect = selectedSlide.getBoundingClientRect();
		const parentRect = section.getBoundingClientRect();
		section.scrollTo({
			top:
				section.scrollTop +
				clamp(selectedRect.bottom - parentRect.bottom, 0, selectedRect.y - parentRect.y),
			left:
				section.scrollLeft +
				clamp(selectedRect.right - parentRect.right, 0, selectedRect.x - parentRect.x)
		});
	}
</script>

<div id="sidebar" style:display="flex" style:flex-direction="column">
	<div
		class="switched"
		style:flex="1"
		style:display="flex"
		style:align-items="stretch"
		style:justify-content="space-between"
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
							selected={index === selectedSlideIndex}
							on:select={() => changeSelected(index)}
							on:delete={async () => {
								slides.splice(index, 1);
								if (index <= selectedSlideIndex) {
									await changeSelected(selectedSlideIndex - 1);
								}
								slides = slides;
							}}
							on:duplicate={async () => {
								const sameSlide = structuredClone(slide);
								sameSlide.id = Date.now();
								slides.splice(index + 1, 0, sameSlide);
								slides = slides;
								await changeSelected(index + 1);
							}}
						/>
					</div>
				{/each}
			</section>
		</div>
		<div id="add-button">
			<FancyButton
				disabled={slides.length >= limits.fuiz.maxSlidesCount}
				on:click={async () => {
					slides.push({
						MultipleChoice: {
							title: '',
							media: undefined,
							introduce_question: limits.fuiz.multipleChoice.introduceQuestion,
							time_limit: limits.fuiz.multipleChoice.defaultTimeLimit,
							points_awarded: limits.fuiz.multipleChoice.pointsAwarded,
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
					<Icon size="1em" src={add_slide} alt={m.add_slide()} />
					<div class="would-be-hidden">{m.add_slide()}</div>
				</div>
			</FancyButton>
		</div>
	</div>
	<div id="controls">
		<div>
			<IconButton
				src={first}
				alt={m.first_slide()}
				size="1.2em"
				padding="0.2em"
				on:click={() => changeSelected(0)}
			/>
		</div>
		<div>
			<IconButton
				src={left}
				alt={m.prev_slide()}
				size="1.2em"
				padding="0.2em"
				on:click={() => changeSelected(selectedSlideIndex - 1)}
			/>
		</div>
		<div>
			<div
				style:height="1.2em"
				style:aspect-ratio="1/1"
				style:padding="0.2em"
				style:text-align="center"
				style:font-weight="bold"
			>
				{selectedSlideIndex + 1}
			</div>
		</div>
		<div>
			<IconButton
				src={right}
				alt={m.next_slide()}
				size="1.2em"
				padding="0.2em"
				on:click={() => changeSelected(selectedSlideIndex + 1)}
			/>
		</div>
		<div>
			<IconButton
				src={last}
				alt={m.last_slide()}
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
		border-inline-end: 0.05em solid #00000020;
	}

	.switched {
		flex-direction: column;
	}

	#add-button {
		padding: 0.4em;
		border-top: 0.05em solid #00000020;
	}

	#controls {
		display: none;
		padding: 0.4em;

		& > div {
			background: color-mix(in srgb, currentColor 20%, transparent);
			border-radius: 0.2em;
		}
	}

	section {
		height: 0;
	}

	@media only screen and (max-width: 600px) {
		section {
			height: unset;
		}

		#add-button {
			border-inline-start: 0.05em solid #00000020;
			border-top: none;
		}

		#controls {
			border-top: 0.05em solid #00000020;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 0.2em;
		}

		#sidebar {
			width: unset;
			height: unset;
			border-top: 0.05em solid #00000020;
			border-inline-end: none;
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
