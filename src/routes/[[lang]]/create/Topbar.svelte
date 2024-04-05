<script lang="ts">
	import * as m from '$paraglide/messages';

	import { goto } from '$app/navigation';
	import { downloadTomlString, limits, stringifyToml, tomlifyConfig } from '$lib';
	import IconButton from '$lib/IconButton.svelte';
	import Logo from '$lib/Logo.svelte';
	import Textfield from '$lib/Textfield.svelte';
	import { languageTag } from '$paraglide/runtime';
	import { route } from '$lib/i18n-routing';
	import { getCreation, type Database } from '$lib/storage';
	import { createEventDispatcher, onMount } from 'svelte';
	import tippy, { type Instance } from 'tippy.js';

	export let title: string;
	export let id: number;
	export let db: Database;

	let dispatch = createEventDispatcher<{
		share: Instance;
	}>();

	let element: HTMLElement;

	let instance: Instance;

	onMount(() => {
		instance = tippy(element, {
			trigger: 'manual',
			content: m.copied(),
			theme: 'fuiz'
		});
	});
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
		href={route('/create', languageTag())}
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
				src="$lib/assets/publish.svg"
				alt={m.publish_title()}
				on:click={() => goto('publish?id=' + id)}
			/>
			<div bind:this={element}>
				<IconButton
					size="1em"
					src="$lib/assets/share.svg"
					alt={m.share()}
					on:click={() => dispatch('share', instance)}
				/>
			</div>
			<IconButton
				size="1em"
				src="$lib/assets/download.svg"
				alt={m.download()}
				on:click={async () => {
					const creation = await getCreation(id, db);
					if (!creation) return;
					const configJson = creation.config;

					downloadTomlString(stringifyToml(tomlifyConfig(configJson)), configJson.title);
				}}
			/>
			<IconButton
				size="1em"
				src="$lib/assets/slideshow.svg"
				alt={m.host()}
				on:click={() => goto('host?id=' + id)}
			/>
		</div>
	</div>
</div>
