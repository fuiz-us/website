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
			<div style:display="flex" style:padding="6px">
				<Icon
					src={buttonSymbols.at(index)?.at(0) ?? ''}
					alt={buttonSymbols.at(index)?.at(1) ?? ''}
					size="36px"
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
					<Icon src={wrong} alt="Wrong" size="36px" />
				</div>
			{:else if correct === true}
				<div style:display="flex" style:padding="6px">
					<Icon src={factual} alt="Correct" size="36px" />
				</div>
			{/if}
		</div>
	</FancyButton>
</div>
