<script lang="ts">
	import type { Slide } from '$lib';
	import MultipleChoiceThumbnail from './MultipleChoiceThumbnail.svelte';
	import delete_slide from '$lib/assets/delete.svg';
	import content_copy from '$lib/assets/content_copy.svg';
	import { createEventDispatcher } from 'svelte';
	import Icon from '$lib/Icon.svelte';

	export let slide: Slide;
	export let index: number;
	export let selected: boolean;

	const dispatch = createEventDispatcher<{
		delete: undefined;
		duplicate: undefined;
		select: undefined;
	}>();
</script>

<div style:display="flex" style:gap="10px" style:box-sizing="border-box">
	<div
		style:display="flex"
		style:justify-content="space-between"
		style:flex-direction="column"
		style:text-align="center"
		style:align-items="center"
		style:font-size="large"
		style:gap="10px"
	>
		<div>
			{index + 1}
		</div>
		<div style:display="flex" style:flex-direction="column" style:gap="5px" style:padding="5px 0">
			<button
				on:click={() => dispatch('delete')}
				style="apperance:none;padding:0;border:0;background:none;cursor:pointer;"
			>
				<Icon src={delete_slide} alt="delete slide" size="24px" />
			</button>
			<button
				on:click={() => dispatch('duplicate')}
				style="apperance:none;padding:0;border:0;background:none;cursor:pointer;"
			>
				<Icon src={content_copy} alt="duplicate" size="24px" />
			</button>
		</div>
	</div>
	<button
		class="thumb"
		style:flex="1"
		style:padding="0"
		style:appearance="none"
		style:background="none"
		style:font="inherit"
		style:border={selected ? '3px solid blue' : '3px solid darkgray'}
		style:border-radius="5px"
		style:overflow="hidden"
		style:cursor="pointer"
		on:click={() => dispatch('select')}
	>
		{#if 'MultipleChoice' in slide}
			<MultipleChoiceThumbnail slide={slide.MultipleChoice} />
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
