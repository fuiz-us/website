<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import { goto } from '$app/navigation';
	import { downloadFuiz, limits } from '$lib';
	import IconButton from '$lib/IconButton.svelte';
	import Logo from '$lib/Logo.svelte';
	import Textfield from '$lib/Textfield.svelte';
	import { getCreation, type Database } from '$lib/storage';
	import { onMount } from 'svelte';
	import tippy, { type Instance } from 'tippy.js';

	interface Props {
		title: string;
		id: number;
		db: Database;
		errorMessage: string | undefined;
		onshare: (instance: Instance) => void;
	}

	let { title = $bindable(), id, db, errorMessage, onshare }: Props = $props();

	let shareButton: HTMLElement | undefined = $state();
	let shareTippyInstance: Instance | undefined = $state();

	let playButton: HTMLElement | undefined = $state();
	let playTippyInstance: Instance | undefined = $state();

	onMount(() => {
		if (!shareButton) return;

		shareTippyInstance = tippy(shareButton, {
			trigger: 'manual',
			content: m.copied(),
			arrow: false,
			theme: 'fuiz'
		});
	});

	$effect(() => {
		if (errorMessage === undefined || errorMessage.length === 0) {
			playTippyInstance?.destroy();
		}
	});

	function onmouseenter() {
		if (!playButton || !errorMessage) return;

		playTippyInstance?.destroy();

		playTippyInstance = tippy(playButton, {
			content: errorMessage,
			arrow: false,
			theme: 'fuiz'
		});

		playTippyInstance.show();
	}
</script>

<div
	style:display="flex"
	style:flex-wrap="wrap"
	style:gap="20px"
	style:box-shadow="0 2px 2px #00000040"
	style:padding="10px"
	style:z-index="1"
	style:align-items="center"
	style:justify-content="center"
>
	<a
		href={'/create'}
		style:height="65px"
		style:margin="0 5px"
		style:overflow="hidden"
		style:color="inherit"
	>
		<Logo height={65} />
	</a>
	<div
		style:flex="1"
		style:display="flex"
		style:gap="10px"
		style:flex-wrap="wrap"
		style:justify-content="center"
	>
		<div
			style:flex="1"
			style:display="flex"
			style:align-items="center"
			style:gap="10px"
			style:justify-content="center"
			style:font-size="24px"
			style:min-width="15ch"
		>
			<Textfield
				bind:value={title}
				placeholder={m.fuiz_title()}
				required={false}
				id="title"
				disabled={false}
				maxLength={limits.fuiz.maxTitleLength}
			/>
		</div>
		<div style:display="flex" style:align-items="center" style:gap="0.2em" style:padding="0.2em">
			<IconButton
				size="1em"
				src=lib/assets/publish.svg
				alt={m.publish_title()}
				onclick={() => goto('publish?id=' + id)}
			/>
			<div bind:this={shareButton}>
				<IconButton
					size="1em"
					src=lib/assets/share.svg
					alt={m.share()}
					onclick={() => {
						if (shareTippyInstance) onshare(shareTippyInstance);
					}}
				/>
			</div>
			<IconButton
				size="1em"
				src=lib/assets/download.svg
				alt={m.download()}
				onclick={async () => {
					const creation = await getCreation(id, db);
					if (!creation) return;
					const configJson = creation.config;
					await downloadFuiz(configJson);
				}}
			/>
			<div bind:this={playButton}>
				<IconButton
					size="1em"
					src=lib/assets/slideshow.svg
					alt={m.host()}
					disabled={errorMessage != undefined}
					onclick={async () => await goto('host?id=' + id)}
					onmouseenter={() => onmouseenter()}
					onfocus={() => onmouseenter()}
				/>
			</div>
		</div>
	</div>
</div>
