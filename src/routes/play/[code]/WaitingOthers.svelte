<script lang="ts">
	import NiceBackground from '$lib/NiceBackground.svelte';
	import answered_penguin from '$lib/assets/answered_penguin.svg';
	import Topbar from './Topbar.svelte';

	export let name: string;
	export let score: number;
</script>

<div style:height="100%" style:display="flex" style:flex-direction="column">
	<Topbar {name} {score} />
	<div style:flex="1">
		<NiceBackground>
			<div
				style:height="100%"
				style:display="flex"
				style:justify-content="center"
				style:align-items="center"
			>
				<div
					style:display="flex"
					style:flex-direction="column"
					style:align-items="center"
					style:font-size="xx-large"
				>
					<img width="200px" src={answered_penguin} alt="two penguins holding answers" />
					<div style:font-weight="bold" style:max-width="10ch" style:text-align="center">
						Waiting for other players
					</div>
				</div>
			</div>
		</NiceBackground>
	</div>
</div>
