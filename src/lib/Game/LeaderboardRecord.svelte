<script lang="ts">
	import { medal_colors, palette_dark, palette_light } from '$lib';
	import Icon from '$lib/Icon.svelte';
	import medal from '$lib/assets/medal.svg';
	export let name: string;
	export let score: number;
	export let index: number;
	export let final: boolean;
</script>

<div id="container" style:display="flex" style:align-items="center" style:gap="10px">
	{#if final}
		<div style:height="100%" style:aspect-ratio="1/1">
			{#if index < 3}
				<div
					style:height="100%"
					style:width="100%"
					style:display="flex"
					style:align-items="center"
					style:justify-content="center"
					style:color={palette_light}
					style:background={medal_colors[index]}
					style:border="2px solid {palette_dark}"
					style:border-radius="10px"
					style:box-sizing="border-box"
				>
					<div style:filter="drop-shadow(0 0 5px rgb(0 0 0 / 0.25))">
						<Icon src={medal} alt="medal" size="1.3em" />
					</div>
				</div>
			{/if}
		</div>
	{/if}
	<div
		style:width="100%"
		style:background={palette_light}
		style:color={palette_dark}
		style:border="2px solid {palette_dark}"
		style:border-radius="10px"
		style:padding="0.3em 0.45em"
		style:box-sizing="border-box"
		style:display="flex"
		style:justify-content="space-between"
	>
		<div>{name}</div>
		<div>{score}</div>
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
