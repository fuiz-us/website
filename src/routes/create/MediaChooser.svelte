<script lang="ts">
	import { buttonColors, palette_light, type Media } from '$lib';
	import delete_image from '$lib/assets/delete.svg';
	import add_photo from '$lib/assets/add_photo.svg';
	import Textbox from '$lib/Textbox.svelte';
	import MediaDisplay from '$lib/MediaDisplay.svelte';

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
	<div style:flex="1" style:display="flex" style:justify-content="center">
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
				style:height="300px"
				style:width="300px"
				style:background={drag_over ? buttonColors[0][0] : 'white'}
				style:border="2px dashed {drag_over ? '#fff' : '#00000040'}"
				style:border-radius="5px"
				style:padding="10px"
				style:box-sizing="border-box"
				style:display="flex"
				style:flex-direction="column"
				style:align-items="center"
				style:gap="10px"
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
				>
					<img
						src={add_photo}
						alt="add"
						style:height="64px"
						style:width="64px"
						style:filter={drag_over ? 'invert(1)' : 'invert(0.5)'}
					/>
					<div
						style:font-size="x-large"
						style:font-weight="bold"
						style:color={drag_over ? palette_light : '#888'}
					>
						Open Image
					</div>
				</label>
				<div
					style:font-size="large"
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
			style:background="white"
			style:flex="1"
			style:font-size="x-large"
			style:gap="20px"
			style:padding="10px"
			style:box-sizing="border-box"
			style:box-shadow="0 0 4px #000000C0"
			style:max-width="50ch"
			style:margin="auto"
		>
			<div style:display="flex">
				<div
					style:flex="1"
					style:text-align="center"
					style:font-size="xx-large"
					style:font-weight="bold"
				>
					Local Image
				</div>
				<button
					style:font="inherit"
					style:display="flex"
					style:height="1.5em"
					style:aspect-ratio="1/1"
					style:appearance="none"
					style:border="none"
					style:background="none"
					style:cursor="pointer"
					on:click={() => {
						media = null;
					}}
				>
					<img
						height="100%"
						width="100%"
						style:display="flex"
						src={delete_image}
						alt="delete answer"
					/>
				</button>
			</div>
			<div style:display="flex" style:gap="10px">
				<div
					style:flex="1"
					style:min-width="200px"
					style:position="relative"
					style:height="300px"
					style:overflow="auto"
				>
					<MediaDisplay {media} />
				</div>
				<div style:display="flex" style:flex-direction="column" style:gap="10px">
					<div>Image Alt:</div>
					<div
						style:flex="1"
						class="focus-within"
						style:overflow="auto"
						style:border="1px solid #00000040"
						style:max-height="400px"
					>
						<Textbox
							bind:value={media.Image.Base64.alt}
							placeholder="a clear description of the image"
							textAlign="start"
						/>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style>
	.focus-within:focus-within {
		outline: 2px solid blueviolet;
	}
</style>
