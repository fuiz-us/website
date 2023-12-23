<script lang="ts">
	import LeaderboardRecord from '$lib/Game/LeaderboardRecord.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';
	import { palette_dark, palette_light } from '$lib';
	export let questionIndex: number;
	export let questionTotalCount: number;
	export let gameId: string;
	export let results: [string, number][];
	export let exact_count: number;
	export let final: boolean;
	export let volume_on: boolean;

	let fullscreenElement;
</script>

<div
	bind:this={fullscreenElement}
	style:height="100%"
	style:display="flex"
	style:flex-direction="column"
>
	<Topbar bind:volume_on {fullscreenElement} {questionIndex} {questionTotalCount} {gameId} />
	<TextBar on:next text="Scores" show_next={true} heading={true} />
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
				{#if exact_count > results.length}
					<div
						id="container"
						style:display="flex"
						style:align-items="center"
						style:gap="10px"
						style:color="white"
					>
						<div
							style:width="100%"
							style:background={palette_light}
							style:color={palette_dark}
							style:border="2px solid {palette_dark}"
							style:border-radius="10px"
							style:padding="0.3em 0.45em"
							style:box-sizing="border-box"
							style:display="flex"
							style:justify-content="center"
						>
							{exact_count - results.length} more...
						</div>
					</div>
				{/if}
			</div>
		</NiceBackground>
	</div>
</div>

<style>
	#container {
		font-size: 1em;
	}

	@media (max-width: 600px) {
		#container {
			font-size: 0.5em;
		}
	}
</style>
