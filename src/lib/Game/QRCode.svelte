<script lang="ts">
	import * as m from '$paraglide/messages';

	import { toDataURL } from 'qrcode';
	import LoadingCircle from '../LoadingCircle.svelte';
	import { createDialog } from 'svelte-headlessui';

	export let url: string;
	export let smallSize: string;

	$: image = toDataURL(url, { scale: 1 });

	const dialog = createDialog({});
</script>

{#await image}
	<div
		style:height={smallSize}
		style:width={smallSize}
		style:display="flex"
		style:justify-content="center"
		style:align-items="center"
		style:border-radius="0.2em"
	>
		<div style:height="64px" style:width="64px">
			<LoadingCircle borderWidth={8} />
		</div>
	</div>
{:then url}
	<button
		on:click={dialog.open}
		style:font="inherit"
		style:appearance="none"
		style:border="none"
		style:background="none"
		style:padding="0"
		style:display="flex"
		style:cursor="pointer"
	>
		<img
			src={url}
			style:height={smallSize}
			style:width={smallSize}
			alt={m.qr_code()}
			style:image-rendering="pixelated"
			style:border-radius="0.2em"
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
					style:font="inherit"
					style:box-sizing="border-box"
					style:background="none"
					style:padding="0"
				>
					<img
						src={url}
						style:margin="auto"
						style:height="80vmin"
						style:width="auto"
						style:aspect-ratio="1"
						style:max-height="700px"
						alt={m.qr_code()}
						style:image-rendering="pixelated"
						style:border-radius="5px"
					/>
				</button>
			</div>
		</div>
	{/if}
{/await}
