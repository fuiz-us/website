<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

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
				<div style:display="flex" style:flex-direction="column" style:align-items="center">
					<img
						style:width="10em"
						src={correct ? correct_penguin : wrong_penguin}
						alt={correct ? m.penguin_checkmark() : m.penguin_crossmark()}
					/>
					<div style:font-weight="bold" style:max-width="10ch" style:text-align="center">
						{#if correct}
							{m.thats_correct()}
						{:else}
							{m.try_again()}
						{/if}
					</div>
				</div>
			</div>
		</NiceBackground>
	</div>
</div>
