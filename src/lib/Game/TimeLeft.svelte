<script lang="ts">
	import hourglassFilled from '$lib/assets/hourglass_filled.svg';
	import hourglassEmpty from '$lib/assets/hourglass_empty.svg';
	import Icon from '$lib/Icon.svelte';
	export let timeLeft: number;
	export let timeStarted: number;

	const size = 40;
</script>

<div
	id="container"
	class={timeLeft <= 5000 ? 'flashing' : ''}
	style:position="absolute"
	style:margin="10px"
	style:display="flex"
	style:top="0"
	style:padding="5px 20px"
	style:gap="10px"
	style:align-items="center"
	style:left="0"
	style:font-family="Poppins"
	style:font-size="36px"
	style:z-index="1"
	style:border-radius="200px"
	style:overflow="hidden"
>
	<div
		style:position="relative"
		style:width="{size}px"
		style:height="{size}px"
		style:background="inherit"
	>
		<div style:position="absolute" style:height="100%" style:overflow="hidden">
			<Icon src={hourglassFilled} alt="filled hourglass" size="{size}px" />
		</div>
		<div
			style:position="absolute"
			style:height="{((timeStarted - timeLeft) / timeStarted) * 100}%"
			style:overflow="hidden"
			style:background="inherit"
		>
			<Icon src={hourglassEmpty} alt="empty hourglass" size="{size}px" />
		</div>
	</div>
	<div>
		{Math.ceil(timeLeft / 1000)}
	</div>
</div>

<style>
	#container {
		background: var(--palette-dark);
		color: var(--palette-light);
		border: 3px solid var(--palette-dark);
	}

	#container.flashing {
		animation: 500ms steps(1) 0s infinite alternate flash;
	}

	@keyframes flash {
		0% {
			background: var(--palette-dark);
			color: var(--palette-light);
		}

		50% {
			background: var(--palette-light);
			color: var(--palette-dark);
		}
	}
</style>
