<script lang="ts">
	import { buttonColors, buttonSymbols } from '$lib';
	import wrong from '$lib/assets/wrong.svg';
	import factual from '$lib/assets/correct.svg';
	import FancyButton from '../FancyButton.svelte';

	export let index: number;
	export let answerText: string;
	export let correct: boolean | undefined;
</script>

<div style:opacity={correct === false ? '50%' : '100%'}>
	<FancyButton
		on:click
		backgroundColor={buttonColors.at(index)?.at(0)}
		backgroundDeepColor={buttonColors.at(index)?.at(1)}
	>
		<div style:height="100%" style:width="100%" style:display="flex" style:align-items="center">
			<div style:display="flex" style:padding="6px">
				<img
					src={buttonSymbols.at(index)?.at(0)}
					alt={buttonSymbols.at(index)?.at(1)}
					height="36px"
					width="36px"
					style:filter="invert(1)"
				/>
			</div>
			<div
				style:height="100%"
				style:flex="1"
				style:display="flex"
				style:justify-content="center"
				style:align-items="center"
				style:font-size="xxx-large"
			>
				{answerText}
			</div>
			{#if correct === false}
				<div style:display="flex" style:padding="6px">
					<img src={wrong} alt="Wrong" height="36px" width="36px" style:filter="invert(1)" />
				</div>
			{:else if correct === true}
				<div style:display="flex" style:padding="6px">
					<img src={factual} alt="Correct" height="36px" width="36px" style:filter="invert(1)" />
				</div>
			{/if}
		</div>
	</FancyButton>
</div>
