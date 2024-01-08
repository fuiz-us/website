<script lang="ts">
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';
	import type { BindableGameInfo, SharedGameInfo } from './+page';
	import type { Media } from '$lib';
	import { PUBLIC_CORKBOARD_URL } from '$env/static/public';

	export let bindableGameInfo: BindableGameInfo;
	export let gameInfo: SharedGameInfo;

	export let questionText: string;
	export let timeStarted: number;
	export let media: Media | undefined;

	let fullscreenElement;
</script>

<svelte:head>
	{#if media && 'Corkboard' in media.Image}
		<link
			rel="prefetch"
			as="image"
			href={PUBLIC_CORKBOARD_URL + '/get/' + media.Image.Corkboard.id}
		/>
	{/if}
</svelte:head>

<div
	style:height="100%"
	bind:this={fullscreenElement}
	style:display="flex"
	style:flex-direction="column"
>
	<div style:border-bottom="0.15em solid currentcolor">
		<Topbar on:lock on:next {fullscreenElement} bind:bindableGameInfo {gameInfo} showSkip={true} />
	</div>
	<div style:flex="1">
		<NiceBackground>
			<div
				style:height="100%"
				style:display="flex"
				style:flex-direction="column"
				style:justify-content="center"
			>
				<TextBar text={questionText} topShadow={true} />
				<div id="progress" style:--duration="{timeStarted}ms">
					<div id="value" />
				</div>
			</div>
		</NiceBackground>
	</div>
</div>

<style>
	#progress {
		height: 0.15em;
	}

	#value {
		height: 100%;
		background: currentColor;
		animation: timer var(--duration) linear;
	}

	@keyframes timer {
		from {
			width: 0%;
		}

		to {
			width: 100%;
		}
	}
</style>
