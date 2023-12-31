<script lang="ts">
	import correct_penguin from '$lib/assets/correct_penguin.svg';
	import wrong_penguin from '$lib/assets/wrong_penguin.svg';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';

	export let name: string;
	export let score: number;
	export let isWinner: boolean;
	export let winners: string[];

	const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
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
					style:padding="0.4em"
					style:align-items="center"
				>
					<img
						style:width="10em"
						src={isWinner ? correct_penguin : wrong_penguin}
						alt={isWinner ? 'penguin holding a checkmark' : 'penguin holding a crossmark'}
					/>
					<div style:font-weight="bold" style:max-width="20ch" style:text-align="center">
						{#if isWinner}
							Congratulations! {formatter.format(['You'].concat(winners.filter((x) => x !== name)))}
							won!
						{:else}
							Try again next time! {formatter.format(winners)} won!
						{/if}
					</div>
				</div>
			</div>
		</NiceBackground>
	</div>
</div>
