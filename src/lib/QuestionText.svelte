<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FancyButton from './FancyButton.svelte';
	import { palette_light } from '$lib';
	export let questionText: string;
	export let topShadow = false;
	export let fontSize = '72px';
	export let show_next = false;

	const dispatch = createEventDispatcher();
</script>

<div
	style:background={palette_light}
	style:display="flex"
	style:align-items="center"
	style:justify-content="center"
	style:padding="20px 15px"
	style:box-shadow="0 2px 2px #00000040{topShadow ? ', 0 -2px 2px #00000040' : ''}"
	style:text-align="center"
>
	<div style:flex="1" style:font-size={fontSize} style:font-weight="bold">
		{questionText}
	</div>
	{#if show_next}
		<div style:font-size="xxx-large">
			<FancyButton on:click={() => dispatch('next')}>
				<div style:padding="0 10px">Next</div>
			</FancyButton>
		</div>
	{/if}
</div>
