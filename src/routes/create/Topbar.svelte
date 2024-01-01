<script lang="ts">
	import { goto } from '$app/navigation';
	import { limits } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import Logo from '$lib/Logo.svelte';
	import Textfield from '$lib/Textfield.svelte';

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
	<a href="/create" style:height="65px" style:margin="0 5px" style:overflow="hidden">
		<Logo height={65} width={162} />
	</a>
	<div style:flex="1" style:display="flex" style:gap="10px">
		<div
			style:flex="1"
			style:display="flex"
			style:align-items="center"
			style:gap="10px"
			style:justify-content="center"
			style:font-size="24px"
			style:min-width="10ch"
		>
			<Textfield
				bind:value={title}
				placeholder="Fuiz Title"
				required={false}
				id="title"
				disabled={false}
				maxLength={limits.fuiz.maxTitleLength}
			/>
		</div>
		<div>
			<FancyButton on:click={() => goto('/host?id=' + id)}>
				<div style:font-family="Poppins" style:padding="0 10px" style:font-size="24px">Play</div>
			</FancyButton>
		</div>
	</div>
</div>
