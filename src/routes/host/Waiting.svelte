<script lang="ts">
	import { PUBLIC_DISPLAY_PLAY_URL, PUBLIC_PLAY_URL } from '$env/static/public';
	import FancyButton from '$lib/FancyButton.svelte';
	import Fullscreen from '$lib/Fullscreen.svelte';
	import bee3 from '$lib/assets/bee3.mp3';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Audio from '$lib/Audio.svelte';
	import PlayersList from '$lib/Game/PlayersList.svelte';
	import volume_up from '$lib/assets/volume_up.svg';
	import volume_off from '$lib/assets/volume_off.svg';
	import unlocked from '$lib/assets/unlocked.svg';
	import locked from '$lib/assets/locked.svg';
	import QrCode from '$lib/Game/QRCode.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { BindableGameInfo } from './+page';
	import StatedIconButton from '$lib/StatedIconButton.svelte';

	export let code: string;
	export let players: string[];
	export let exact_count: number;

	export let bindableGameInfo: BindableGameInfo;

	let codeTitle = 'Copy to Clipboard';

	$: actualUrl = PUBLIC_PLAY_URL + '/play?code=' + code;

	const dispatch = createEventDispatcher<{
		next: undefined;
		lock: boolean;
	}>();

	function copy_url_to_clipboard() {
		navigator.clipboard.writeText(actualUrl);
		codeTitle = 'Copied!';
	}

	let fullscreenElement;
</script>

<Audio audioUrl={bee3} volumeOn={bindableGameInfo.volumeOn} />
<div id="container" bind:this={fullscreenElement} style:height="100%" style:display="flex">
	<div
		style:background="var(--background-color)"
		style:box-shadow="0 2px 2px #00000040, 2px 0 2px #00000040"
		style:display="flex"
		style:flex-direction="column"
		style:align-items="center"
		style:gap="1em"
		style:padding="0.6em 0.4em"
		style:justify-content="space-between"
	>
		<div style:padding="0.4em">
			<div>Join At</div>
			<div style:font-weight="bold">
				{PUBLIC_DISPLAY_PLAY_URL}/play
			</div>
		</div>
		<div
			style:background="color-mix(in srgb, currentColor 20%, transparent)"
			style:display="flex"
			style:flex-direction="column"
			style:align-items="center"
			style:padding="0.4em"
			style:gap="0.4em"
			style:border-radius="0.4em"
		>
			<button
				on:click={copy_url_to_clipboard}
				title={codeTitle}
				style:font="inherit"
				style:color="inherit"
				style:appearance="none"
				style:border="none"
				style:background="none"
				style:cursor="pointer"
				style:text-align="start"
				style:font-family="Poppins"
			>
				<div style:font-size="1em">Game Code:</div>
				<div style:font-size="3em" style:line-height="1em" style:text-transform="uppercase">
					{code}
				</div>
			</button>
			<QrCode url={actualUrl} smallSize="9em" />
		</div>
		<div
			style:display="flex"
			style:justify-content="center"
			style:width="fit-content"
			style:font-size="1.5em"
		>
			<FancyButton on:click={() => dispatch('next')}>
				<div style:padding="0 1em" style:font-family="Poppins">Start</div>
			</FancyButton>
		</div>
	</div>
	<div style:flex="1">
		<NiceBackground>
			<div
				style:height="100%"
				style:display="flex"
				style:flex-direction="column"
				style:gap="0.2em"
				style:padding="0.2em"
				style:box-sizing="border-box"
			>
				<div style:margin-left="auto" style:display="flex" style:gap="0.2em">
					<StatedIconButton
						icons={[
							{ src: unlocked, alt: 'Lock Game' },
							{ src: locked, alt: 'Unlock Game' }
						]}
						size="1em"
						bind:state={bindableGameInfo.locked}
						on:change={(e) => {
							dispatch('lock', e.detail);
						}}
					/>
					<StatedIconButton
						icons={[
							{ src: volume_off, alt: 'Turn on Music' },
							{ src: volume_up, alt: 'Mute Music' }
						]}
						size="1em"
						bind:state={bindableGameInfo.volumeOn}
					/>
					<Fullscreen {fullscreenElement} />
				</div>
				<div
					style:min-height="40vh"
					style:margin="auto"
					style:display="flex"
					style:align-items="center"
					style:justify-content="center"
				>
					<div
						id="players"
						style:display="flex"
						style:justify-content="center"
						style:align-items="center"
						style:flex-wrap="wrap"
						style:max-width="40ch"
						style:gap="0.2em"
						style:padding="0.2em"
						style:overflow="auto"
					>
						<PlayersList {players} exactCount={exact_count} />
					</div>
				</div>
			</div>
		</NiceBackground>
	</div>
</div>

<style>
	#players {
		font-size: 1.5em;
	}

	@media (max-width: 700px) {
		#container {
			flex-direction: column;
		}

		#players {
			font-size: 0.8em;
		}
	}
</style>
