<script lang="ts">
	import logo from '$lib/assets/logo.svg';

	export let height = 60;
	export let width = 150;
</script>

<div style:height="100%" style:display="flex" style:aspect-ratio="11/4">
	<img
		src={logo}
		height="{height}px"
		width="{width}px"
		alt="a deck of cards representing fuiz logo and the word fuiz"
		style:margin-right="auto"
		style:display="flex"
		style:height="100%"
		style:width="auto"
	/>
</div>
