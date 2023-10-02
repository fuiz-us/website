<script lang="ts">
	import type { Media } from '$lib';
	import delete_image from '$lib/assets/delete.svg';
	import add_photo from '$lib/assets/add_photo.svg';
	import FancyButton from '$lib/FancyButton.svelte';
	import MediaContainer from '$lib/MediaContainer.svelte';
	import Textbox from '$lib/Textbox.svelte';

	export let media: Media | undefined;
</script>

{#if media === undefined}
	<div style:flex="1" style:display="flex" style:justify-content="center">
		<div>
			<FancyButton
				on:click={() =>
					(media = {
						Image: {
							Internet: {
								url: '',
								alt: ''
							}
						}
					})}
			>
				<div
					style:font-size="xx-large"
					style:padding="5px 15px"
					style:display="flex"
					style:align-items="center"
					style:gap="5px"
				>
					<img
						src={add_photo}
						style:display="flex"
						alt="add"
						style:height="1em"
						style:width="1em"
						style:filter="invert(1)"
					/>
					Add Media
				</div>
			</FancyButton>
		</div>
	</div>
{:else}
	<div
		style:background="white"
		style:flex="1"
		style:font-size="x-large"
		style:display="flex"
		style:flex-direction="column"
		style:gap="10px"
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
				Online Image
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
					media = undefined;
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
			<div style:flex="1" style:position="relative" style:height="300px" style:overflow="auto">
				<MediaContainer {media} align="start" />
			</div>
			<div style:display="flex" style:flex-direction="column" style:gap="10px">
				<div>Image Alt</div>
				<div
					class="focus-within"
					style:overflow="auto"
					style:flex="1"
					style:max-height="200px"
					style:border="1px solid #00000040"
				>
					<Textbox
						bind:value={media.Image.Internet.alt}
						placeholder="a clear description of the image"
					/>
				</div>
			</div>
		</div>
		<div style:display="flex" style:align-items="center" style:gap="10px">
			<label for="url">Image URL</label>
			<div
				style:flex="1"
				class="focus-within"
				style:border="1px solid #00000040"
				style:max-height="2em"
				style:overflow="auto"
			>
				<Textbox
					textAlign="start"
					bind:value={media.Image.Internet.url}
					placeholder="https://..."
				/>
			</div>
		</div>
	</div>
{/if}

<style>
	.focus-within:focus-within {
		outline: 2px solid blueviolet;
	}
</style>
