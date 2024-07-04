<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import correct_penguin from '$lib/assets/correct_penguin.svg';
	import wrong_penguin from '$lib/assets/wrong_penguin.svg';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';
	import { languageTag } from '$lib/paraglide/runtime.js';

	export let name: string;
	export let score: number;
	export let isWinner: boolean;
	export let winners: string[];

	const formatter = new Intl.ListFormat(languageTag(), { style: 'long', type: 'conjunction' });
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
						alt={isWinner ? m.penguin_checkmark() : m.penguin_crossmark()}
					/>
					<div style:font-weight="bold" style:max-width="20ch" style:text-align="center">
						{#if isWinner}
							{m.congrats()}
							{m.list_won({
								winners: formatter.format(['You'].concat(winners.filter((x) => x !== name)))
							})}
						{:else}
							{m.try_again()}
							{m.list_won({
								winners: formatter.format(winners)
							})}
						{/if}
					</div>
				</div>
			</div>
		</NiceBackground>
	</div>
</div>
