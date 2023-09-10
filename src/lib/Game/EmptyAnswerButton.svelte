<script lang="ts">
	import { buttonColors, buttonSymbols } from '$lib';
	import FancyButton from '../FancyButton.svelte';

	export let index: number;
</script>

<div>
	<FancyButton
		on:click
		backgroundColor={buttonColors.at(index)?.at(0)}
		backgroundDeepColor={buttonColors.at(index)?.at(1)}
	>
		<div
			style:height="100%"
			style:width="100%"
			style:display="flex"
			style:align-items="center"
			style:justify-content="center"
		>
			<img
				src={buttonSymbols.at(index)?.at(0)}
				alt={buttonSymbols.at(index)?.at(1)}
				style:height="128px"
				style:width="128px"
				style:max-height="75%"
				style:max-width="75%"
				style:filter="invert(1)"
			/>
		</div>
	</FancyButton>
</div>
