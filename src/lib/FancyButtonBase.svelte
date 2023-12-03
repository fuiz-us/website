<script lang="ts">
	export let foregroundColor: string;
	export let backgroundColor: string;
	export let backgroundDeepColor: string;
	export let disabled = false;
	export let active = true;
</script>

<button
	style:display="flex"
	style:background="none"
	style:border="none"
	style:box-sizing="border-box"
	style:padding="7px 0 0 0"
	style:width="100%"
	style:height="100%"
	style:font="inherit"
	style:outline="none"
	disabled={disabled || !active}
	on:click
>
	<div
		style:background={disabled ? '#636363' : backgroundDeepColor}
		style:border-radius="10px"
		style:transform="translateY(0)"
		style:width="100%"
		style:height="100%"
	>
		<div
			class="front"
			style:background={disabled ? '#737373' : backgroundColor}
			style:border="2px solid {backgroundDeepColor}"
			style:border-radius="10px"
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
		transform: translateY(-4px);
		transition: transform 150ms;
	}

	button:active:not(:disabled) .front {
		transform: translateY(0px);
	}

	button:where(:hover, :focus) .front {
		transform: translateY(-7px);
	}
</style>
