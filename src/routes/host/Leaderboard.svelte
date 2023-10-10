<script lang="ts">
	import FancyButton from '$lib/FancyButton.svelte';
	import LeaderboardRecord from '$lib/Game/LeaderboardRecord.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import { createEventDispatcher } from 'svelte';
	import Topbar from './Topbar.svelte';
	import { palette_light } from '$lib';
	export let questionIndex: number;
	export let questionTotalCount: number;
	export let gameId: string;
	export let results: [string, number][];
	export let final: boolean;
	export let volume_on: boolean;

	const dispatch = createEventDispatcher();
</script>

<div style:height="100%" style:display="flex" style:flex-direction="column">
	<Topbar bind:volume_on {questionIndex} {questionTotalCount} {gameId} />
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
		<div style:flex="1">Leaderboard</div>
		<div>
			<FancyButton on:click={() => dispatch('next')}>
				<div style:padding="0 10px">Next</div>
			</FancyButton>
		</div>
	</div>
	<div style:flex="1">
		<NiceBackground>
			<div
				style:height="100%"
				style:margin="auto"
				style:padding="10px"
				style:font-size="xxx-large"
				style:max-width="30ch"
				style:display="flex"
				style:justify-content="center"
				style:gap="10px"
				style:flex-direction="column"
				style:box-sizing="border-box"
			>
				{#each results as [name, score], index}
					<LeaderboardRecord {name} {score} {index} {final} />
				{/each}
			</div>
		</NiceBackground>
	</div>
</div>
