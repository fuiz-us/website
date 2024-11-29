<script lang="ts">
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';
	import type { Media } from '$lib/types';
	import { PUBLIC_CORKBOARD_URL } from '$env/static/public';

	interface Props {
		name: string;
		score: number;
		questionText: string;
		media: Media | undefined;
	}

	let { name, score, questionText, media }: Props = $props();
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
		<div
			style:height="100%"
			style:display="flex"
			style:flex-direction="column"
			style:justify-content="center"
		>
			<TextBar text={questionText} topShadow={true} />
		</div>
	</NiceBackground>
</div>
