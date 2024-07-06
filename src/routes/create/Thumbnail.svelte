<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import MultipleChoiceThumbnail from './MultipleChoiceThumbnail.svelte';
	import delete_slide from '$lib/assets/delete.svg';
	import content_copy from '$lib/assets/content_copy.svg';
	import { createEventDispatcher } from 'svelte';
	import IconButton from '$lib/IconButton.svelte';
	import type { Slide } from '$lib/types';
	import TypeAnswerThumbnail from './TypeAnswerThumbnail.svelte';
	import OrderThumbnail from './OrderThumbnail.svelte';

	export let slide: Slide;
	export let index: number;
	export let selected: boolean;

	const dispatch = createEventDispatcher<{
		delete: undefined;
		duplicate: undefined;
		select: undefined;
	}>();
</script>

<div style:display="flex" style:gap="0.4em" style:box-sizing="border-box">
	<div
		style:display="flex"
		style:justify-content="space-between"
		style:flex-direction="column"
		style:text-align="center"
		style:align-items="center"
		style:gap="0.4em"
	>
		<div>
			{index + 1}
		</div>
		<div
			style:display="flex"
			style:flex-direction="column"
			style:gap="0.2em"
			style:padding="0.2em 0"
		>
			<IconButton
				on:click={() => dispatch('delete')}
				src={delete_slide}
				alt={m.delete_confirm()}
				size="1em"
			/>
			<IconButton
				on:click={() => dispatch('duplicate')}
				src={content_copy}
				alt={m.duplicate()}
				size="1em"
			/>
		</div>
	</div>
	<button
		class="thumb"
		style:flex="1"
		style:padding="0"
		style:appearance="none"
		style:background="none"
		style:font="inherit"
		style:color="inherit"
		style:border="none"
		style:outline={selected ? '3px solid var(--accent-color)' : '1px solid darkgray'}
		style:border-radius="0.5em"
		style:overflow="hidden"
		style:cursor="pointer"
		on:click={() => dispatch('select')}
	>
		{#if 'MultipleChoice' in slide}
			<MultipleChoiceThumbnail slide={slide.MultipleChoice} />
		{:else if 'Order' in slide}
			<OrderThumbnail slide={slide.Order} />
		{:else}
			<TypeAnswerThumbnail slide={slide.TypeAnswer} />
		{/if}
	</button>
</div>

<style>
	@media only screen and (max-width: 600px) {
		.thumb {
			width: 150px;
		}
	}
</style>
