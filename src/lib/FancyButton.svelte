<script lang="ts">
	import type { Action } from 'svelte/action';
	import FancyButtonBase from './FancyButtonBase.svelte';
	export let foregroundColor: string | undefined = undefined;
	export let backgroundColor: string | undefined = undefined;
	export let backgroundDeepColor: string | undefined = undefined;
	export let disabled = false;
	export let active = true;
	export let action: Action | undefined = undefined;
</script>

<FancyButtonBase
	action={action ||
		(() => {
			// do nothing
		})}
	on:select
	foregroundColor={foregroundColor ?? '#FFFFFF'}
	backgroundColor={backgroundColor ?? '#D4131B'}
	backgroundDeepColor={backgroundDeepColor ?? '#A40E13'}
	{disabled}
	{active}
	on:click
>
	<div
		style:height="100%"
		style:padding="5px"
		style:font-weight="bold"
		style:box-sizing="border-box"
	>
		<slot />
	</div>
</FancyButtonBase>
