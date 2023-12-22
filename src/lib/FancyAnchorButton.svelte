<script lang="ts">
	import FancyAnchorButtonBase from './FancyAnchorButtonBase.svelte';
	export let foregroundColor: string | undefined = undefined;
	export let backgroundColor: string | undefined = undefined;
	export let backgroundDeepColor: string | undefined = undefined;

	export let href: string;
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
		<slot />
	</div>
</FancyAnchorButtonBase>
