<script lang="ts">
	import { buttonColors, buttonSymbols } from '$lib';
	import Icon from '$lib/Icon.svelte';
	import FancyButton from '../FancyButton.svelte';

	export let index: number;
</script>

<div>
	<FancyButton
		on:click
		backgroundColor={buttonColors.at(index % buttonColors.length)?.at(0)}
		backgroundDeepColor={buttonColors.at(index % buttonColors.length)?.at(1)}
	>
		<div
			style:height="100%"
			style:width="100%"
			style:display="flex"
			style:align-items="center"
			style:justify-content="center"
		>
			<div
				style:width="100%"
				style:height="auto"
				style:aspect-ratio="1"
				style:max-height="65%"
				style:max-width="65%"
			>
				<Icon
					src={buttonSymbols.at(index % buttonColors.length)?.at(0) ?? ''}
					alt={buttonSymbols.at(index % buttonColors.length)?.at(1) ?? ''}
					size="100%"
				/>
			</div>
		</div>
	</FancyButton>
</div>
