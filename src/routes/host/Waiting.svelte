<script lang="ts">
	import { PUBLIC_DISPLAY_PLAY_URL, PUBLIC_PLAY_URL } from '$env/static/public';
	import { palette_light } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import Fullscreen from '$lib/Fullscreen.svelte';
	import bee3 from '$lib/assets/bee3.mp3';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import PlayersList from '$lib/Game/PlayersList.svelte';
	import volume_up from '$lib/assets/volume_up.svg';
	import volume_off from '$lib/assets/volume_off.svg';
	import QrCode from '$lib/Game/QRCode.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import IconButton from '$lib/IconButton.svelte';

	export let code: string;
	export let players: string[];
	export let exact_count: number;
	export let truncated: boolean;
	export let volume_on: boolean;
	let codeTitle = 'Copy to Clipboard';

	$: actualUrl = PUBLIC_PLAY_URL + '/play?code=' + code;

	const dispatch = createEventDispatcher();

	function copy_url_to_clipboard() {
		navigator.clipboard.writeText(actualUrl);
		codeTitle = 'Copied!';
	}

	const audio = new Audio(bee3);
	audio.loop = true;
	$: audio.volume = volume_on ? 1.0 : 0.0;

	onMount(() => {
		audio.play();
		return () => {
			audio.pause();
		};
	});
</script>

<div id="container" style:height="100%" style:display="flex">
	<div
		style:background={palette_light}
		style:box-shadow="0 2px 2px #00000040, 2px 0 2px #00000040"
		style:display="flex"
		style:flex-direction="column"
		style:align-items="center"
		style:gap="20px"
		style:padding="20px 10px"
		style:justify-content="space-between"
	>
		<div style:display="flex" style:align-items="center" style:gap="5px" style:padding="10px">
			<div
				style:flex="1"
				style:display="flex"
				style:justify-content="center"
				style:align-items="center"
				style:gap="25px"
			>
				<div style:font-size="xx-large" style:padding="10px">
					<div>Join at</div>
					<div style:font-weight="bold">
						{PUBLIC_DISPLAY_PLAY_URL}/play
					</div>
				</div>
			</div>
		</div>
		<div
			style:background="#00000020"
			style:display="flex"
			style:flex-direction="column"
			style:align-items="center"
			style:padding="10px"
			style:gap="10px"
			style:border-radius="10px"
		>
			<button
				on:click={copy_url_to_clipboard}
				title={codeTitle}
				style:appearance="none"
				style:border="none"
				style:background="none"
				style:cursor="pointer"
				style:text-align="start"
				style:font-family="Poppins"
			>
				<div style:font-size="24px">Game Code:</div>
				<div style:font-size="92px" style:line-height="1em" style:text-transform="uppercase">
					{code}
				</div>
			</button>
			<QrCode url={actualUrl} small_size="300px" />
		</div>
		<div style:display="flex" style:justify-content="center">
			<div style:width="fit-content">
				<FancyButton on:click={() => dispatch('next')}>
					<div style:font-size="xxx-large" style:padding="5px 50px" style:font-family="Poppins">
						Start
					</div>
				</FancyButton>
			</div>
		</div>
	</div>
	<div style:flex="1">
		<NiceBackground>
			<div
				style:height="100%"
				style:display="flex"
				style:flex-direction="column"
				style:gap="10px"
				style:padding="10px 10px 0"
				style:box-sizing="border-box"
			>
				<div style:margin-left="auto" style:display="flex" style:gap="5px">
					<IconButton
						src={volume_on ? volume_up : volume_off}
						alt={volume_on ? 'Mute Music' : 'Turn on Music'}
						size="24px"
						on:click={() => (volume_on = !volume_on)}
					/>
					<Fullscreen />
				</div>
				<div
					id="players"
					style:margin="auto"
					style:display="flex"
					style:justify-content="center"
					style:align-items="center"
					style:flex-wrap="wrap"
					style:max-width="50ch"
					style:min-height="40vh"
					style:padding="10px"
					style:gap="10px"
					style:overflow="auto"
				>
					<PlayersList {players} {exact_count} {truncated} />
				</div>
			</div>
		</NiceBackground>
	</div>
</div>

<style>
	#players {
		font-size: 38px;
	}

	@media (max-width: 700px) {
		#container {
			flex-direction: column;
		}

		#players {
			font-size: 32px;
		}
	}
</style>
