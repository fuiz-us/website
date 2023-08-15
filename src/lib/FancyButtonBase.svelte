<script>
	export let foregroundColor = '#FFFFFF';
	export let backgroundColor = '#E66100';
	export let backgroundDeepColor = '#C64600';
</script>

<button
	style:display="flex"
	style:background="none"
	style:border="none"
	style:padding="5px 0 0 0"
	style:width="100%"
	style:height="100%"
	style:font="inherit"
>
	<div
		style:background={backgroundDeepColor}
		style:border-radius="5px"
		style:transform="translateY(0)"
		style:width="100%"
		style:height="100%"
	>
		<div
			class="front"
			style:background={backgroundColor}
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
	.front:not(:active) {
		transform: translateY(-5px);
	}
</style>
