<script lang="ts">
	import { toDataURL } from 'qrcode';
	import LoadingCircle from '../LoadingCircle.svelte';
	import { createDialog } from 'svelte-headlessui';

	export let url: string;
	export let small_size: string;

	$: image = toDataURL(url);

	const dialog = createDialog({});
</script>

{#await image}
	<div
		style:height={small_size}
		style:width={small_size}
		style:display="flex"
		style:justify-content="center"
		style:align-items="center"
		style:border-radius="5px"
	>
		<div style:height="64px" style:width="64px">
			<LoadingCircle borderWidth={8} color="black" />
		</div>
	</div>
{:then url}
	<button
		on:click={dialog.open}
		style:appearance="none"
		style:border="none"
		style:background="none"
		style:padding="0"
		style:display="flex"
		style:cursor="pointer"
	>
		<img
			src={url}
			height={small_size}
			width={small_size}
			alt="QR code to the game"
			style:image-rendering="pixelated"
			style:border-radius="5px"
		/>
	</button>
	{#if $dialog.expanded}
		<div
			style:position="fixed"
			style:z-index="1"
			style:inset="0"
			style:background="#000000A0"
			style:display="flex"
			style:height="100%"
			style:width="100%"
		>
			<div style:margin="auto" use:dialog.modal>
				<button
					on:click={dialog.close}
					style:appearance="none"
					style:border="none"
					style:background="none"
					style:padding="0"
				>
					<img
						src={url}
						style:margin="auto"
						height="700px"
						width="700px"
						alt="QR code to the game"
						style:image-rendering="pixelated"
						style:border-radius="5px"
					/>
				</button>
			</div>
		</div>
	{/if}
{/await}
