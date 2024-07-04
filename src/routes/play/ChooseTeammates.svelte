<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';
	import { createEventDispatcher } from 'svelte';
	import PlayersList from '$lib/Game/PlayersList.svelte';

	export let name: string;
	export let gameCode: string;
	export let available: [string, boolean][];
	export let max: number;

	let dispatch = createEventDispatcher<{
		choose: string[];
	}>();

	$: {
		dispatch(
			'choose',
			available.filter(([, sel]) => sel).map(([name]) => name)
		);
	}
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
				<div
					style:display="flex"
					style:flex-direction="column"
					style:align-items="center"
					style:text-align="center"
				>
					<div
						style:font-weight="bold"
						style:font-family="Poppins"
						style:font-size="1.5em"
						style:max-width="10ch"
						style:text-align="center"
					>
						Choose Your Teammates
					</div>
					<div>and tell them to choose you!</div>
					<div
						style:display="flex"
						style:gap="0.5em"
						style:flex-wrap="wrap"
						style:padding="1em"
						style:justify-content="center"
					>
						<PlayersList
							bind:players={available}
							exactCount={available.length}
							{max}
							selectable={true}
						/>
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
		<div style:font-weight="bold">{m.game_code()}</div>
		<div style:font-size="2em" style:font-family="Poppins" style:text-transform="uppercase">
			{gameCode}
		</div>
	</div>
</div>
