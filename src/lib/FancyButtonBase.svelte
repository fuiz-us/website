<script lang="ts">
	import type { Action } from 'svelte/action';

	export let foregroundColor: string;
	export let backgroundColor: string;
	export let backgroundDeepColor: string;
	export let disabled = false;
	export let active = true;
	export let type: 'button' | 'submit' | 'reset' | undefined = undefined;
	export let action: Action;
	export let height: string | undefined = undefined;
</script>

<button
	use:action
	on:select
	{type}
	style:display="flex"
	style:background="none"
	style:border="none"
	style:color="inherit"
	style:box-sizing="border-box"
	style:padding="0.3em 0 0 0"
	style:width="100%"
	style:height={height ?? 'fit-content'}
	style:font="inherit"
	style:outline="none"
	disabled={disabled || !active}
	on:click
>
	<div
		style:background={disabled ? '#636363' : backgroundDeepColor}
		style:transition="background 300ms linear"
		style:border-radius="0.7em"
		style:transform="translateY(0)"
		style:width="100%"
		style:height="100%"
	>
		<div
			class="front"
			style:background-color={disabled ? '#737373' : backgroundColor}
			style:border="0.1em solid {disabled ? '#636363' : backgroundDeepColor}"
			style:border-radius="0.7em"
			style:box-sizing="border-box"
			style:color={foregroundColor}
			style:width="100%"
			style:height="100%"
		>
			<slot />
		</div>
	</div>
</button>

<style>
	button .front {
		transform: translateY(-0.15em);
		transition: transform 150ms, background-color 300ms linear, border-color 300ms linear;
	}

	button:active:not(:disabled) .front {
		transform: translateY(0em);
	}

	button:where(:hover, :focus) .front {
		transform: translateY(-0.3em);
	}
</style>
