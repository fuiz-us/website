<script lang="ts">
	import FancyAnchorButtonBase from './FancyAnchorButtonBase.svelte';

	interface Props {
		foregroundColor?: string | undefined;
		backgroundColor?: string | undefined;
		backgroundDeepColor?: string | undefined;
		href: string;
		children?: import('svelte').Snippet;
	}

	let {
		foregroundColor = undefined,
		backgroundColor = undefined,
		backgroundDeepColor = undefined,
		href,
		children
	}: Props = $props();
</script>

<FancyAnchorButtonBase
	foregroundColor={foregroundColor ?? '#FFFFFF'}
	backgroundColor={backgroundColor ?? '#D4131B'}
	backgroundDeepColor={backgroundDeepColor ?? '#A40E13'}
	{href}
>
	<div
		style:height="100%"
		style:padding="5px"
		style:font-weight="bold"
		style:box-sizing="border-box"
	>
		{@render children?.()}
	</div>
</FancyAnchorButtonBase>
