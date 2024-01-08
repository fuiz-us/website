<script lang="ts">
	import * as m from '$paraglide/messages';

	import Fullscreen from '$lib/Fullscreen.svelte';
	import Icon from '$lib/Icon.svelte';
	import icon from '$lib/assets/icon.svg';
	import volume_up from '$lib/assets/volume_up.svg';
	import volume_off from '$lib/assets/volume_off.svg';
	import unlocked from '$lib/assets/unlocked.svg';
	import locked from '$lib/assets/locked.svg';
	import IconButton from '$lib/IconButton.svelte';
	import skip from '$lib/assets/skip.svg';
	import { createEventDispatcher } from 'svelte';
	import { createDialog } from 'svelte-headlessui';
	import { goto } from '$app/navigation';
	import FancyButton from '$lib/FancyButton.svelte';
	import type { BindableGameInfo, SharedGameInfo } from './+page';
	import StatedIconButton from '$lib/StatedIconButton.svelte';

	export let bindableGameInfo: BindableGameInfo;
	export let gameInfo: SharedGameInfo;

	export let fullscreenElement: HTMLElement | undefined = undefined;
	export let showSkip = false;

	const exitDialog = createDialog({ label: m.end_fuiz() });

	const dispatch = createEventDispatcher<{
		next: undefined;
		lock: boolean;
	}>();
</script>

<div
	style:display="flex"
	style:background="var(--background-color)"
	style:padding="0.2em"
	style:line-height="1em"
	style:align-items="center"
	style:gap="10px"
	style:row-gap="20px"
	style:justify-content="center"
	style:flex-wrap="wrap"
>
	<button
		on:click={exitDialog.open}
		style:cursor="pointer"
		style:appearance="none"
		style:display="flex"
		style:padding="0.2em 0.4em"
		style:gap="2px"
		style:align-items="center"
		style:line-height="1em"
		style:font-size="inherit"
		style:font-family="Poppins"
		style:background="var(--color)"
		style:color="var(--background-color)"
		style:border="none"
		style:border-radius="100px"
	>
		<Icon src={icon} alt={m.exit()} size="1em" />
		<div>fuiz.us</div>
	</button>
	{#if $exitDialog.expanded}
		<div
			style:position="fixed"
			style:z-index="5"
			style:inset="0"
			style:width="100%"
			style:height="100%"
			style:display="flex"
			style:align-items="center"
			style:justify-content="center"
			style:background="#000000A0"
		>
			<div
				use:exitDialog.modal
				style:background="var(--background-color)"
				style:padding="20px"
				style:margin="20px"
				style:display="flex"
				style:flex-direction="column"
				style:gap="20px"
				style:border-radius="10px"
			>
				<h1
					style:font-family="Poppins"
					style:text-align="center"
					style:line-height="1"
					style:margin="0"
				>
					{m.end_fuiz()}
				</h1>
				<div
					style:display="flex"
					style:flex-wrap="wrap"
					style:justify-content="space-between"
					style:gap="20px"
					style:width="30ch"
					style:max-width="80vw"
				>
					<div style:flex="1">
						<FancyButton
							on:click={exitDialog.close}
							backgroundColor="var(--background-color)"
							backgroundDeepColor="currentcolor"
							foregroundColor="currentcolor"
						>
							<div style:padding="5px 10px" style:white-space="nowrap">{m.cancel()}</div>
						</FancyButton>
					</div>
					<div style:flex="1">
						<FancyButton on:click={() => goto('create')}>
							<div style:padding="5px 10px" style:white-space="nowrap">{m.end()}</div>
						</FancyButton>
					</div>
				</div>
			</div>
		</div>
	{/if}
	<div
		style:display="flex"
		style:padding="0.2em 0.4em"
		style:gap="2px"
		style:align-items="center"
		style:font-family="Poppins"
	>
		<div style:font-family="Poppins">
			{m.slide_index({
				index: gameInfo.questionIndex + 1,
				total: gameInfo.questionTotalCount
			})}
		</div>
	</div>
	<div
		style:flex="100"
		style:justify-content="center"
		style:display="flex"
		style:gap="1ch"
		style:align-items="baseline"
		style:white-space="nowrap"
		style:font-family="Poppins"
	>
		{m.game_code_display({
			code: gameInfo.gameCode
		})}
	</div>
	<div
		style:flex="1"
		style:display="flex"
		style:justify-content="space-between"
		style:align-items="center"
		style:gap="0.2em"
		style:padding="0.2em"
	>
		{#if showSkip}
			<IconButton src={skip} alt={m.skip()} size="1em" on:click={() => dispatch('next')} />
		{/if}
		<StatedIconButton
			icons={[
				{ src: unlocked, alt: m.lock_game() },
				{ src: locked, alt: m.unlock_game() }
			]}
			size="1em"
			bind:state={bindableGameInfo.locked}
			on:change={(e) => {
				dispatch('lock', e.detail);
			}}
		/>
		<StatedIconButton
			icons={[
				{ src: volume_off, alt: m.turn_on_music() },
				{ src: volume_up, alt: m.mute_music() }
			]}
			size="1em"
			bind:state={bindableGameInfo.volumeOn}
		/>
		<Fullscreen {fullscreenElement} />
	</div>
</div>
