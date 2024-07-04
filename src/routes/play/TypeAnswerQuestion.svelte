<script lang="ts">
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';
	import type { Media } from '$lib/types';
	import { PUBLIC_CORKBOARD_URL } from '$env/static/public';
	import { createEventDispatcher } from 'svelte';
	import Textfield from '$lib/Textfield.svelte';
	import FancyButton from '$lib/FancyButton.svelte';

	let dispatch = createEventDispatcher<{
		answer: string;
	}>();

	let value = '';

	export let name: string, score: number, questionText: string, media: Media | undefined;
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
	<TextBar text={questionText} topShadow={false} />
	<NiceBackground>
		<div
			style:display="flex"
			style:padding="0.5em"
			style:flex-direction="column"
			style:align-items="center"
			style:width="min(100%, 20ch)"
			style:margin="auto"
			style:justify-content="center"
			style:height="100%"
			style:box-sizing="border-box"
		>
			<Textfield id="answer" placeholder="Answer" required disabled={false} bind:value />
			<div style:width="100%">
				<FancyButton on:click={() => dispatch('answer', value)}>Submit</FancyButton>
			</div>
		</div>
	</NiceBackground>
</div>
