<script lang="ts">
	import FancyButtonBase from './FancyButtonBase.svelte';
	interface Props {
		foregroundColor?: string | undefined;
		backgroundColor?: string | undefined;
		backgroundDeepColor?: string | undefined;
		disabled?: boolean;
		active?: boolean;
		type?: 'button' | 'submit' | 'reset' | undefined;
		height?: string | undefined;
		children?: import('svelte').Snippet;
		onclick?: () => void;
	}

	let {
		foregroundColor = undefined,
		backgroundColor = undefined,
		backgroundDeepColor = undefined,
		disabled = false,
		active = true,
		type = undefined,
		height = undefined,
		onclick = undefined,
		children
	}: Props = $props();
</script>

<FancyButtonBase
	{type}
	foregroundColor={foregroundColor ?? '#FFFFFF'}
	backgroundColor={backgroundColor ?? '#D4131B'}
	backgroundDeepColor={backgroundDeepColor ?? '#A40E13'}
	{disabled}
	{active}
	{height}
	{onclick}
>
	<div
		style:height="100%"
		style:padding="5px"
		style:font-weight="bold"
		style:box-sizing="border-box"
	>
		{@render children?.()}
	</div>
</FancyButtonBase>
