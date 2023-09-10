<script lang="ts">
	import { buttonColors, buttonSymbols } from '$lib';

	export let statistics: { count: number; correct: boolean }[] = [];

	$: maximum = statistics.reduce((a, b) => (a > b.count ? a : b.count), 0);
</script>

<div
	style:display="flex"
	style:padding="15px"
	style:max-height="350px"
	style:gap="15px"
	style:height="100%"
	style:box-sizing="border-box"
>
	{#each statistics as { count, correct }, index}
		<div
			style:display="flex"
			style:flex-direction="column-reverse"
			style:gap="5px"
			style:height="100%"
			style:opacity={correct ? 1 : 0.5}
		>
			<div
				style:display="flex"
				style:justify-content="center"
				style:border-radius="5px"
				style:padding="6px 18px"
				style:background={buttonColors.at(index)?.at(0)}
			>
				<img
					src={buttonSymbols.at(index)?.at(0)}
					alt={buttonSymbols.at(index)?.at(1)}
					height="36px"
					width="36px"
					style:filter="invert(1)"
				/>
			</div>
			<div style:display="flex" style:flex-direction="column-reverse" style:height="100%">
				<div
					style:background={buttonColors.at(index)?.at(0)}
					style:border-radius="5px"
					style:height="max(10px, calc((100% - 48px) * {maximum === 0 ? 0 : count / maximum}))"
				/>
				<div
					style:display="flex"
					style:justify-content="center"
					style:color={buttonColors.at(index)?.at(0)}
					style:font-family="Poppins"
					style:font-size="xx-large"
				>
					{count}
				</div>
			</div>
		</div>
	{/each}
</div>
