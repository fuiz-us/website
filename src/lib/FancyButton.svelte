<script>
	import FancyButtonBase from './FancyButtonBase.svelte';
	export let foregroundColor = '#FFFFFF';
	export let backgroundColor = '#E66100';
	export let backgroundDeepColor = '#C64600';
</script>

<FancyButtonBase bind:foregroundColor bind:backgroundColor bind:backgroundDeepColor>
	<div style:padding="5px" style:font-weight="bold">
		<slot />
	</div>
</FancyButtonBase>
