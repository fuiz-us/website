<script>
	export let foregroundColor = '#FFFFFF';
	export let backgroundColor = '#D4131B';
	export let backgroundDeepColor = '#a40e13';
	export let disabled = false;
</script>

<button
	style:display="flex"
	style:background="none"
	style:border="none"
	style:box-sizing="border-box"
	style:padding="5px 0 0 0"
	style:width="100%"
	style:height="100%"
	style:font="inherit"
	{disabled}
	on:click
>
	<div
		style:background={disabled ? '#636363' : backgroundDeepColor}
		style:border-radius="5px"
		style:transform="translateY(0)"
		style:width="100%"
		style:height="100%"
	>
		<div
			class="front"
			style:background={disabled ? '#737373' : backgroundColor}
			style:border-radius="5px"
			style:color={foregroundColor}
			style:width="100%"
			style:height="100%"
		>
			<slot />
		</div>
	</div>
</button>

<style>
	button:not(:active:not(:disabled)) .front {
		transform: translateY(-5px);
	}
</style>
