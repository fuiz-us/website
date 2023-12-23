<script lang="ts">
	import NiceBackground from '$lib/NiceBackground.svelte';
	import waiting_penguin from '$lib/assets/waiting.svg';
	import Topbar from './Topbar.svelte';

	export let name: string;
	export let gameCode: string;
</script>

<div style:height="100%" style:display="flex" style:flex-direction="column">
	<Topbar {name} />
	<div style:flex="1">
		<NiceBackground>
			<div
				style:height="100%"
				style:display="flex"
				style:justify-content="center"
				style:align-items="center"
			>
				<div style:display="flex" style:flex-direction="column" style:align-items="center">
					<img style:width="10em" src={waiting_penguin} alt="penguin waiting on a bus stop" />
					<div style:font-weight="bold" style:max-width="10ch" style:text-align="center">
						Waiting for the host to start
					</div>
				</div>
			</div>
		</NiceBackground>
	</div>
	<div
		style:background="var(--background-color)"
		style:text-align="center"
		style:padding="5px 0"
		style:border-top="0.15em solid"
	>
		<div style:font-weight="bold">Game Code:</div>
		<div style:font-size="2em" style:font-family="Poppins" style:text-transform="uppercase">
			{gameCode}
		</div>
	</div>
</div>
