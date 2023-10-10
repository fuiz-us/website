<script lang="ts">
	import { palette_light } from '$lib';
	import Icon from '$lib/Icon.svelte';
	import score_image from '$lib/assets/score.svg';

	export let name: string;
	export let score: number | undefined = undefined;
</script>

<div
	style:display="flex"
	style:box-shadow="0 2px 2px #00000040"
	style:background={palette_light}
	style:padding="5px 10px"
	style:font-size="xx-large"
	style:align-items="center"
	style:box-sizing="border-box"
>
	<div
		style:display="flex"
		style:padding="5px 15px"
		style:font-family="Poppins"
		style:overflow-wrap="anywhere"
		style:box-sizing="border-box"
	>
		{name}
	</div>
	{#if score}
		<div
			style:margin-left="auto"
			style:font-weight="bold"
			style:display="flex"
			style:gap="3px"
			style:padding="5px 15px"
			style:box-sizing="border-box"
			style:align-items="center"
		>
			<div style:font-family="Poppins">
				{score}
			</div>
			<Icon src={score_image} alt="points" size="48px" />
		</div>
	{/if}
</div>
