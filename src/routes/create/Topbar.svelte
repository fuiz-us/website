<script lang="ts">
	import { base } from '$app/paths';
	import { play_local } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import Logo from '$lib/Logo.svelte';
	import Textbox from '$lib/Textbox.svelte';

	export let title: string;
	export let id: number;
	export let db: IDBDatabase;
</script>

<div
	style:display="flex"
	style:gap="5px"
	style:box-shadow="0 2px 2px #00000040"
	style:padding="10px"
	style:z-index="1"
	style:align-items="center"
>
	<a href="{base}/create/" style:height="65px" style:margin="0 5px" style:overflow="hidden">
		<Logo />
	</a>
	<div style:flex="1" style:display="flex" style:justify-content="center">
		<div
			class="focus-within"
			style:font-weight="bold"
			style:background="#ddd"
			style:border-radius="5px"
			style:font-size="clamp(1.25em,8vw,2em)"
		>
			<Textbox bind:value={title} placeholder="Title" />
		</div>
	</div>
	<div>
		<FancyButton on:click={() => play_local(id, db)}>
			<div style:font-family="Poppins" style:padding="5px 10px" style:font-size="min(1.5em, 5vw)">
				Play
			</div>
		</FancyButton>
	</div>
</div>

<style>
	.focus-within:focus-within {
		outline: 2px solid blueviolet;
	}
</style>
