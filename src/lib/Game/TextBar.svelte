<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FancyButton from '../FancyButton.svelte';
	import { palette_light } from '$lib';
	export let text: string;
	export let topShadow = false;
	export let show_next = false;

	const dispatch = createEventDispatcher();

	export let heading = false;
</script>

<div
	style:background={palette_light}
	style:display="flex"
	style:line-height="1.2"
	style:align-items="center"
	style:justify-content="center"
	style:padding="0.2em 0.4em"
	style:border-bottom="0.15em solid currentcolor"
	style:border-top={topShadow ? '0.15em solid currentcolor' : ''}
	style:text-align="center"
	style:z-index="1"
>
	<div
		style:flex="1"
		style:font-size="1.5em"
		style:font-weight="bold"
		style:word-break="break-word"
		style:font-family={heading ? 'Poppins' : 'inherit'}
	>
		{text}
	</div>
	{#if show_next}
		<div style:font-size="1.2em" style:font-family="Poppins">
			<FancyButton on:click={() => dispatch('next')}>
				<div style:padding="0.2em 0.4em">Next</div>
			</FancyButton>
		</div>
	{/if}
</div>
