<script lang="ts">
	import * as m from '$paraglide/messages';

	import { goto } from '$app/navigation';
	import {
		downloadJsonString as downloadTomlString,
		getCreation,
		getLocalConfig,
		limits
	} from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import Logo from '$lib/Logo.svelte';
	import * as TOML from '@ltd/j-toml';
	import Textfield from '$lib/Textfield.svelte';
	import { languageTag } from '$paraglide/runtime';
	import { route } from '$lib/i18n-routing';

	export let title: string;
	export let id: number;
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
		<Logo height={65} width={162} />
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
		<div>
			<FancyButton
				on:click={async () => {
					const [creation] = await getCreation(id);
					const configJson = await getLocalConfig(creation);

					let tomlified = TOML.stringify(
						{
							title: configJson.title,
							slides: configJson.slides.map((slide) =>
								TOML.Section({
									MultipleChoice: TOML.Section(slide.MultipleChoice)
								})
							)
						},
						{ newline: '\n', newlineAround: 'section', integer: 1000000 }
					);

					downloadTomlString(tomlified, configJson.title);
				}}
			>
				<div style:font-family="Poppins" style:padding="0 10px" style:font-size="24px">
					{m.download()}
				</div>
			</FancyButton>
		</div>
		<div>
			<FancyButton on:click={() => goto('host?id=' + id)}>
				<div style:font-family="Poppins" style:padding="0 10px" style:font-size="24px">
					{m.play()}
				</div>
			</FancyButton>
		</div>
	</div>
</div>
