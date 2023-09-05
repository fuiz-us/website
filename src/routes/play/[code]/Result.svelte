<script lang="ts">
	import NiceBackground from '$lib/NiceBackground.svelte';
	import correct_penguin from '$lib/assets/correct_penguin.svg';
	import wrong_penguin from '$lib/assets/wrong_penguin.svg';
	import Topbar from './Topbar.svelte';

	export let name: string;
	export let score: number;
	export let correct: boolean;
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
					<img
						width="200px"
						src={correct ? correct_penguin : wrong_penguin}
						alt={correct ? 'penguin holding a checkmark' : 'penguin holding a crossmark'}
					/>
					<div style:font-weight="bold" style:max-width="10ch" style:text-align="center">
						{#if correct}
							That’s correct!
						{:else}
							Try again next time!
						{/if}
					</div>
				</div>
			</div>
		</NiceBackground>
	</div>
</div>
