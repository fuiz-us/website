<script lang="ts">
	import { buttonColors, buttonSymbols } from '$lib';
	import wrong from '$lib/assets/wrong.svg';
	import factual from '$lib/assets/correct.svg';
	import FancyButton from '../FancyButton.svelte';
	import Icon from '$lib/Icon.svelte';

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
			<div id="icon" style:display="flex" style:padding="0.2em">
				<Icon
					src={buttonSymbols.at(index)?.at(0) ?? ''}
					alt={buttonSymbols.at(index)?.at(1) ?? ''}
					size="1em"
				/>
			</div>
			<div
				id="text"
				style:height="100%"
				style:flex="1"
				style:display="flex"
				style:justify-content="center"
				style:align-items="center"
			>
				{answerText}
			</div>
			{#if correct === false}
				<div style:display="flex" style:padding="0.2em">
					<Icon src={wrong} alt="Wrong" size="1em" />
				</div>
			{:else if correct === true}
				<div style:display="flex" style:padding="0.2em">
					<Icon src={factual} alt="Correct" size="1em" />
				</div>
			{/if}
		</div>
	</FancyButton>
</div>
