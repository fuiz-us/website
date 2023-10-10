<script lang="ts">
	import { medal_colors } from '$lib';
	import Icon from '$lib/Icon.svelte';
	import medal from '$lib/assets/medal.svg';
	export let name: string;
	export let score: number;
	export let index: number;
	export let final: boolean;
</script>

<div style:display="flex" style:align-items="center" style:gap="10px" style:color="white">
	{#if final}
		<div style:height="100%" style:aspect-ratio="1/1">
			{#if index < 3}
				<div
					style:height="100%"
					style:width="100%"
					style:display="flex"
					style:align-items="center"
					style:justify-content="center"
					style:background={medal_colors[index]}
					style:border-radius="5px"
					style:padding="12px"
					style:box-sizing="border-box"
				>
					<div style:filter="drop-shadow(0 2px 2px rgb(0 0 0 / 0.25))">
						<Icon src={medal} alt="medal" size="100%" />
					</div>
				</div>
			{/if}
		</div>
	{/if}
	<div
		style:width="100%"
		style:background="#606060"
		style:border-radius="5px"
		style:padding="10px 15px"
		style:box-sizing="border-box"
		style:display="flex"
		style:justify-content="space-between"
	>
		<div>{name}</div>
		<div>{score}</div>
	</div>
</div>
