<script lang="ts">
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';
	import type { Media } from '$lib/types';
	import { PUBLIC_CORKBOARD_URL } from '$env/static/public';
	import Textfield from '$lib/Textfield.svelte';
	import FancyButton from '$lib/FancyButton.svelte';
	import MediaContainer from '$lib/MediaContainer.svelte';

	let value = $state('');

	interface Props {
		name: string;
		score: number;
		questionText: string;
		media: Media | undefined;
		onanswer: (answer: string) => void;
	}

	let { name, score, questionText, media, onanswer }: Props = $props();
</script>

<svelte:head>
	{#if media && 'Corkboard' in media.Image}
		<link
			rel="preload"
			as="image"
			href={PUBLIC_CORKBOARD_URL + '/get/' + media.Image.Corkboard.id}
		/>
	{/if}
</svelte:head>

<div style:display="flex" style:flex-direction="column" style:height="100%">
	<Topbar {name} {score} />
	<NiceBackground>
		<div style:height="100%" style:display="flex" style:flex-direction="column">
			{#if media}
				<div style:height="40vh" style:padding="0.5em" style:box-sizing="border-box">
					<div style:position="relative" style:height="100%">
						<MediaContainer {media} fit="contain" />
					</div>
				</div>
			{/if}
			<TextBar text={questionText} topShadow={(media ?? undefined) !== undefined} />
			<div
				style:display="flex"
				style:padding="0.5em"
				style:flex-direction="column"
				style:align-items="center"
				style:width="min(100%, 20ch)"
				style:margin="auto"
				style:justify-content="center"
				style:flex="1"
				style:box-sizing="border-box"
			>
				<Textfield id="answer" placeholder="Answer" required disabled={false} bind:value />
				<div style:width="100%">
					<FancyButton onclick={() => onanswer(value)}>Submit</FancyButton>
				</div>
			</div>
		</div>
	</NiceBackground>
</div>
