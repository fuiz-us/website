<script lang="ts">
	import { afterUpdate, beforeUpdate } from 'svelte';

	export let value: string;
	export let placeholder: string;
	export let textAlign = 'center';
	export let lightText = false;
	export let padding = '5px';

	$: placeholderColor = lightText ? '#FFFFFF80' : '#00000080';

	let editableElement: HTMLTextAreaElement;

	beforeUpdate(async () => {
		value = value.replaceAll('\n', '').replaceAll('\r', '');
	});

	afterUpdate(async () => {
		editableElement.style.minHeight = '0';
		editableElement.style.minHeight = editableElement.scrollHeight.toString() + 'px';
	});
</script>

<textarea
	bind:this={editableElement}
	bind:value
	style:background="none"
	style:color="inherit"
	style:display="flex"
	style:font="inherit"
	style:width="100%"
	style:padding
	style:text-align={textAlign}
	{placeholder}
	style:box-sizing="border-box"
	style:word-wrap="anywhere"
	style:border="none"
	style:resize="none"
	style:margin="0"
	style:outline="none"
	style:height="100%"
	style="--placeholderColor: {placeholderColor}"
	rows="1"
/>

<style>
	textarea::placeholder {
		color: var(--placeholderColor);
	}
</style>
