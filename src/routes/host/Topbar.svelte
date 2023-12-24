<script lang="ts">
	import Fullscreen from '$lib/Fullscreen.svelte';
	import Icon from '$lib/Icon.svelte';
	import icon from '$lib/assets/icon.svg';
	import volume_up from '$lib/assets/volume_up.svg';
	import volume_off from '$lib/assets/volume_off.svg';
	import IconButton from '$lib/IconButton.svelte';
	import skip from '$lib/assets/skip.svg';
	import { createEventDispatcher } from 'svelte';
	import { createDialog } from 'svelte-headlessui';
	import { goto } from '$app/navigation';
	import FancyButton from '$lib/FancyButton.svelte';

	export let questionIndex: number;
	export let questionTotalCount: number;
	export let gameId: string;
	export let volume_on: boolean;
	export let fullscreenElement: HTMLElement | undefined = undefined;

	export let show_skip = false;

	const exitDialog = createDialog({ label: 'End Fuiz?' });

	const dispatch = createEventDispatcher();
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
		<Icon src={icon} alt="exit app" size="1em" />
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
					End Game?
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
							<div style:padding="5px 10px" style:white-space="nowrap">Go Back</div>
						</FancyButton>
					</div>
					<div style:flex="1">
						<FancyButton on:click={() => goto('/create')}>
							<div style:padding="5px 10px" style:white-space="nowrap">End Game</div>
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
			{questionIndex + 1} of {questionTotalCount}
		</div>
	</div>
	<div
		style:flex="100"
		style:justify-content="center"
		style:display="flex"
		style:gap="1ch"
		style:align-items="baseline"
		style:white-space="nowrap"
	>
		Game ID:
		<div style:font-family="Poppins" style:text-transform="uppercase">
			{gameId}
		</div>
	</div>
	<div
		style:flex="1"
		style:display="flex"
		style:justify-content="space-between"
		style:align-items="center"
		style:gap="0.2em"
		style:padding="0.2em"
	>
		{#if show_skip}
			<IconButton src={skip} alt="Skip this slide" size="1em" on:click={() => dispatch('next')} />
		{/if}
		<IconButton
			src={volume_on ? volume_up : volume_off}
			alt={volume_on ? 'Mute Music' : 'Turn on Music'}
			size="1em"
			on:click={() => (volume_on = !volume_on)}
		/>
		<Fullscreen {fullscreenElement} />
	</div>
</div>
