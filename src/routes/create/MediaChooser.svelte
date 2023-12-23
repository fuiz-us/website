<script lang="ts">
	import { buttonColors, palette_light, type Media } from '$lib';
	import delete_image from '$lib/assets/delete.svg';
	import add_photo from '$lib/assets/add_photo.svg';
	import hearing from '$lib/assets/hearing.svg';
	import MediaDisplay from '$lib/MediaDisplay.svelte';
	import Icon from '$lib/Icon.svelte';
	import Textarea from '$lib/Textarea.svelte';

	export let media: Media | null | undefined;

	let drag_over = false;

	function load_from_input() {
		const target = document.querySelector('input[type=file]');
		if (target) {
			const input_image = target as HTMLInputElement;
			load_file(input_image.files?.item(0) ?? undefined);
		}
	}

	function load_file(file: File | undefined) {
		drag_over = false;
		if (file == undefined) {
			media = undefined;
			return;
		}
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.addEventListener('load', () => {
			media = {
				Image: {
					Base64: {
						data: reader.result?.toString() ?? '',
						alt: ''
					}
				}
			};
		});
	}
</script>

{#if !media}
	<div style:flex="1" style:padding="10px" style:display="flex" style:justify-content="center">
		<input
			style:display="none"
			type="file"
			name="image_input"
			accept="image/png"
			id="image_input"
			on:change={load_from_input}
		/>
		<button
			style:appearance="none"
			style:border="none"
			style:padding="none"
			style:font="inherit"
			style:background="none"
			on:dragover|preventDefault={() => {
				drag_over = true;
			}}
			on:dragenter={() => {
				drag_over = true;
			}}
			on:dragleave={() => {
				drag_over = false;
			}}
			on:drop|preventDefault={(e) => {
				drag_over = false;
				let files = e.dataTransfer?.files ?? undefined;
				if (files && files.length > 0) {
					load_file(e.dataTransfer?.files?.item(0) ?? undefined);
				}
			}}
		>
			<div
				style:aspect-ratio="1"
				style:width="15ch"
				style:background={drag_over ? buttonColors[0][0] : 'transparent'}
				style:border="0.1em dashed {drag_over ? '#fff' : '#00000040'}"
				style:border-radius="0.7em"
				style:padding="0.4em"
				style:box-sizing="border-box"
				style:display="flex"
				style:flex-direction="column"
				style:align-items="center"
				style:gap="0.4em"
				style:transition="background 200ms"
			>
				<label
					for="image_input"
					style:flex="1"
					style:display="flex"
					style:flex-direction="column"
					style:align-items="center"
					style:cursor="pointer"
					style:justify-content="center"
					style:color={drag_over ? palette_light : '#888'}
				>
					<Icon size="2em" src={add_photo} alt="add" />
					<div style:font-weight="bold">Open Image</div>
				</label>
				<div
					style:font-size="0.7em"
					style:font-weight="bold"
					style:color={drag_over ? palette_light : '#888'}
				>
					or Drop it Here!
				</div>
			</div>
		</button>
	</div>
{:else if 'Image' in media}
	{#if 'Base64' in media.Image}
		<div
			style:display="flex"
			style:flex-direction="column"
			style:border="0.15em solid #00000040"
			style:flex="1"
			style:border-radius="0.7em"
			style:gap="0.4em"
			style:padding="0.3em"
			style:box-sizing="border-box"
			style:max-width="40ch"
			style:margin="auto"
		>
			<div style:display="flex" style:align-items="center">
				<div style:flex="1" style:text-align="center" style:font-family="Poppins">Local Image</div>
				<button
					style:font="inherit"
					style:display="flex"
					style:padding="0.2em"
					style:appearance="none"
					style:border="none"
					style:background="none"
					style:cursor="pointer"
					on:click={() => {
						media = null;
					}}
				>
					<Icon size="1.25em" src={delete_image} alt="delete image" />
				</button>
			</div>
			<div
				style:flex-direction="column"
				style:align-items="stretch"
				style:display="flex"
				style:gap="0.4em"
			>
				<div
					style:width="100%"
					style:height="100%"
					style:max-width="10em"
					style:min-width="5em"
					style:position="relative"
					style:max-height="10em"
					style:display="flex"
					style:flex-direction="column"
					style:overflow="auto"
					style:margin="auto"
				>
					<MediaDisplay {media} fit="contain" />
				</div>
				<div style:display="flex" style:align-items="center" style:gap="10px">
					<Icon size="1.2em" src={hearing} alt="Image Alt" />
					<div style:flex="1">
						<Textarea
							id="alt"
							required={false}
							disabled={false}
							max_height="5em"
							bind:value={media.Image.Base64.alt}
							placeholder="Alt Text"
						/>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}
