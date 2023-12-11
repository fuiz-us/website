<script lang="ts">
	import { palette_light } from '$lib';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import Topbar from './Topbar.svelte';
	import TextBar from '$lib/Game/TextBar.svelte';

	export let questionIndex: number;
	export let questionTotalCount: number;
	export let gameId: string;
	export let volume_on: boolean;

	export let winners: string[];
</script>

<NiceBackground>
	<Topbar bind:volume_on {questionIndex} {questionTotalCount} {gameId} />
	<TextBar on:next text="Winners" show_next={true} />
	<div
		style:display="flex"
		style:flex-direction="column"
		style:max-width="30ch"
		style:font-size="xxx-large"
		style:margin="auto"
		style:text-align="center"
		style:padding="10px"
		style:gap="10px"
	>
		{#each winners as w}
			<div
				style:padding="10px"
				style:background="#000000c0"
				style:color={palette_light}
				style:border-radius="10px"
			>
				{w}
			</div>
		{/each}
	</div>
</NiceBackground>
