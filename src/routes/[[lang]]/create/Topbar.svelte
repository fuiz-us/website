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

	export let title: string;
	export let id: number;
	export let db: Database;
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
				alt="Publish"
				on:click={() => goto('publish?id=' + id)}
			/>
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
