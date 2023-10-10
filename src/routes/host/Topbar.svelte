<script lang="ts">
	import { palette_light } from '$lib';
	import Fullscreen from '$lib/Fullscreen.svelte';
	import Icon from '$lib/Icon.svelte';
	import volume_up from '$lib/assets/volume_up.svg';
	import volume_off from '$lib/assets/volume_off.svg';
	import IconButton from '$lib/IconButton.svelte';
	import skip from '$lib/assets/skip.svg';
	import { createEventDispatcher } from 'svelte';

	export let questionIndex: number;
	export let questionTotalCount: number;
	export let gameId: string;
	export let volume_on: boolean;

	export let show_skip = false;

	const dispatch = createEventDispatcher();
</script>

<div style:display="flex" style:background={palette_light} style:padding="5px 10px">
	<div style:font-family="Poppins">
		{questionIndex + 1} of {questionTotalCount}
	</div>
	<div
		style:margin="auto"
		style:font-weight="bold"
		style:display="flex"
		style:gap="1ch"
		style:align-items="baseline"
	>
		Game ID:
		<div style:font-family="Poppins" style:text-transform="uppercase">
			{gameId}
		</div>
	</div>
	<div style:display="flex" style:align-items="center" style:gap="4px">
		{#if show_skip}
			<button
				on:click={() => dispatch('next')}
				style:height="24px"
				style:width="24px"
				style:padding="0"
				style:background="none"
				style:appearance="none"
				style:border="none"
				style:cursor="pointer"
			>
				<Icon src={skip} alt="skip" size="24px" />
			</button>
		{/if}
		<IconButton
			src={volume_on ? volume_up : volume_off}
			alt={volume_on ? 'Mute Music' : 'Turn on Music'}
			size="24px"
			on:click={() => (volume_on = !volume_on)}
		/>
		<div style:height="24px" style:width="24px">
			<Fullscreen />
		</div>
	</div>
</div>
