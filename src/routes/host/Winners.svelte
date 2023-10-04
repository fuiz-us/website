<script lang="ts">
	import { palette_light } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import { createEventDispatcher } from 'svelte';
	import Topbar from './Topbar.svelte';

	export let questionIndex: number;
	export let questionTotalCount: number;
	export let gameId: string;

	export let winners: string[];

	const dispatch = createEventDispatcher();
</script>

<NiceBackground>
	<Topbar {questionIndex} {questionTotalCount} {gameId} />
	<div
		style:background={palette_light}
		style:display="flex"
		style:align-items="center"
		style:justify-content="center"
		style:font-size="xxx-large"
		style:font-weight="bold"
		style:padding="20px 15px"
		style:box-shadow="0 2px 2px #00000040"
		style:text-align="center"
	>
		<div style:flex="1">Winners</div>
		<div>
			<FancyButton on:click={() => dispatch('next')}>
				<div style:padding="0 10px">Next</div>
			</FancyButton>
		</div>
	</div>
	<div
		style:display="flex"
		style:flex-direction="column"
		style:max-width="30ch"
		style:font-size="xxx-large"
		style:margin="auto"
		style:text-align="center"
		style:padding="10px"
		style:gap="10px"
	>
		{#each winners as w}
			<div
				style:padding="10px"
				style:background="#000000c0"
				style:color={palette_light}
				style:border-radius="10px"
			>
				{w}
			</div>
		{/each}
	</div>
</NiceBackground>
