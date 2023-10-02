<script lang="ts">
	import { base } from '$app/paths';
	import { play_local } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import Logo from '$lib/Logo.svelte';
	import Textbox from '$lib/Textbox.svelte';

	export let title: string;
	export let id: number;
</script>

<div
	style:display="flex"
	style:box-shadow="0 2px 2px #00000040"
	style:padding="10px"
	style:z-index="1"
	style:align-items="center"
>
	<a href="{base}/create/" style:height="50px" style:margin="0 10px" style:overflow="hidden">
		<Logo />
	</a>
	<div style:flex="1" style:display="flex" style:justify-content="center">
		<div
			class="focus-within"
			style:font-weight="bold"
			style:background="#ddd"
			style:border-radius="5px"
			style:font-size="xx-large"
		>
			<Textbox bind:value={title} placeholder="title" />
		</div>
	</div>
	<div>
		<FancyButton on:click={() => play_local(id)}>
			<div style:font-family="Poppins" style:padding="5px 15px" style:font-size="x-large">Play</div>
		</FancyButton>
	</div>
</div>

<style>
	.focus-within:focus-within {
		outline: 2px solid blueviolet;
	}
</style>
