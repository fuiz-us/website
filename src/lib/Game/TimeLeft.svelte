<script lang="ts">
	import hourglassFilled from '$lib/assets/hourglass_filled.svg';
	import hourglassEmpty from '$lib/assets/hourglass_empty.svg';
	import Icon from '$lib/Icon.svelte';
	export let timeLeft: number;
	export let timeStarted: number;

	const size = '1.2em';
</script>

<div
	id="container"
	class={timeLeft <= 5000 ? 'flashing' : ''}
	style:display="flex"
	style:padding="0.2em 0.6em"
	style:gap="0.3em"
	style:align-items="center"
	style:font-family="Poppins"
	style:border-radius="200px"
	style:overflow="hidden"
>
	<div style:position="relative" style:width={size} style:height={size} style:background="inherit">
		<div style:position="absolute" style:height="100%" style:overflow="hidden">
			<Icon src={hourglassFilled} alt="filled hourglass" {size} />
		</div>
		<div
			style:position="absolute"
			style:height="{(-(timeStarted - timeLeft) / timeStarted) * 30 + 85}%"
			style:overflow="hidden"
			style:background="inherit"
		>
			<Icon src={hourglassEmpty} alt="empty hourglass" {size} />
		</div>
		<div style:position="absolute" style:height="50%" style:overflow="hidden">
			<Icon src={hourglassFilled} alt="filled hourglass" {size} />
		</div>
		<div
			style:position="absolute"
			style:height="{((timeStarted - timeLeft) / timeStarted) * 30 + 15}%"
			style:overflow="hidden"
			style:background="inherit"
		>
			<Icon src={hourglassEmpty} alt="empty hourglass" {size} />
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
		border: 0.15em solid var(--palette-dark);
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
