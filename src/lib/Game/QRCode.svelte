<script lang="ts">
	import { toDataURL } from 'qrcode';
	import LoadingCircle from '../LoadingCircle.svelte';

	let expandQR = false;
	export let url: string;

	$: image = toDataURL(url);
</script>

{#await image}
	<div
		style:height="172px"
		style:width="172px"
		style:display="flex"
		style:justify-content="center"
		style:align-items="center"
	>
		<div style:height="64px" style:width="64px">
			<LoadingCircle borderWidth={8} color="black" />
		</div>
	</div>
{:then url}
	{#if !expandQR}
		<button
			on:click={() => (expandQR = true)}
			style:appearance="none"
			style:border="none"
			style:padding="0"
			style:display="flex"
			style:cursor="pointer"
		>
			<img
				src={url}
				height="172px"
				width="172px"
				alt="QR code to the game"
				style:image-rendering="crisp-edges"
			/>
		</button>
	{:else}
		<div style:position="absolute" style:z-index="1" style:inset="0">
			<button
				on:click|self={() => (expandQR = false)}
				style:appearance="none"
				style:background="#000000A0"
				style:display="flex"
				style:height="100%"
				style:width="100%"
				style:padding="0"
				style:border="none"
			>
				<img
					src={url}
					style:margin="auto"
					height="700px"
					width="700px"
					alt="QR code to the game"
					style:image-rendering="crisp-edges"
				/>
			</button>
		</div>
	{/if}
{/await}
