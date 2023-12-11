<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FancyButton from '../FancyButton.svelte';
	import { palette_light } from '$lib';
	export let text: string;
	export let topShadow = false;
	export let show_next = false;

	const dispatch = createEventDispatcher();
</script>

<div
	style:background={palette_light}
	style:display="flex"
	style:align-items="center"
	style:justify-content="center"
	style:padding="10px 10px"
	style:box-shadow="0 2px 2px #00000040{topShadow ? ', 0 -2px 2px #00000040' : ''}"
	style:text-align="center"
>
	<div style:flex="1" style:font-size="42px" style:font-weight="bold" style:word-break="break-word">
		{text}
	</div>
	{#if show_next}
		<div style:font-size="32px" style:font-family="Poppins">
			<FancyButton on:click={() => dispatch('next')}>
				<div style:padding="0 0.4em">Next</div>
			</FancyButton>
		</div>
	{/if}
</div>
