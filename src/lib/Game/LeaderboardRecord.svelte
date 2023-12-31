<script lang="ts">
	import { medalColors } from '$lib';
	import Icon from '$lib/Icon.svelte';
	import medal from '$lib/assets/medal.svg';
	export let name: string;
	export let score: number;
	export let index: number;
	export let final: boolean;
</script>

<div id="container" style:display="flex" style:align-items="center" style:gap="0.2em">
	{#if final}
		<div style:height="100%" style:aspect-ratio="1/1">
			{#if index < 3}
				<div
					style:height="100%"
					style:width="100%"
					style:display="flex"
					style:align-items="center"
					style:justify-content="center"
					style:background="var(--palette-dark)"
					style:border="0.15em solid currentcolor"
					style:font-weight="bold"
					style:border-radius="0.6em"
					style:box-sizing="border-box"
				>
					<div style:color={medalColors[index]}>
						<Icon src={medal} alt="medal" size="1.3em" />
					</div>
				</div>
			{/if}
		</div>
	{/if}
	<div
		style:width="100%"
		style:background="var(--background-color)"
		style:border="0.15em solid currentcolor"
		style:padding="0.15em 0.4em"
		style:font-weight="bold"
		style:border-radius="0.6em"
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
