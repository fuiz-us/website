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

<div style:height="100%" style:display="flex" style:flex-direction="column">
	<div style:background={palette_light} style:box-shadow="0 2px 2px #00000040">
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
				<button
					on:click={copy_url_to_clipboard}
					title={codeTitle}
					style:font-size="92px"
					style:appearance="none"
					style:border="none"
					style:cursor="pointer"
					style:padding="10px 20px"
					style:font-family="'Poppins', sans-serif"
					style:display="flex"
					style:background="#00000020"
					style:border-radius="5px"
					style:text-transform="uppercase"
				>
					{code}
				</button>
				<div
					style:background="#00000020"
					style:display="flex"
					style:padding="5px"
					style:border-radius="5px"
				>
					<QrCode url={actualUrl} />
				</div>
			</div>

			<div style:margin-bottom="auto" style:display="flex" style:gap="5px">
				<IconButton
					src={volume_on ? volume_up : volume_off}
					alt={volume_on ? 'Mute Music' : 'Turn on Music'}
					size="32px"
					on:click={() => (volume_on = !volume_on)}
				/>
				<Fullscreen />
			</div>
		</div>
	</div>
	<div style:flex="1">
		<NiceBackground>
			<div
				style:height="100%"
				style:display="flex"
				style:flex-direction="column"
				style:gap="5px"
				style:padding="10px"
				style:box-sizing="border-box"
			>
				<div
					style:margin="auto"
					style:font-size="xx-large"
					style:display="flex"
					style:justify-content="center"
					style:flex-wrap="wrap"
					style:gap="5px"
					style:max-width="1000px"
					style:max-height="500px"
					style:overflow="scroll"
				>
					<PlayersList {players} {exact_count} {truncated} />
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
		</NiceBackground>
	</div>
</div>
