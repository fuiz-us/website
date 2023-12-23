<script lang="ts">
	import '@fontsource/poppins/800.css';
	import '@fontsource/atkinson-hyperlegible';
</script>

<slot />

<style>
	:global(body) {
		display: contents;
		font-family: 'Atkinson Hyperlegible', sans-serif;
		font-size: 32px;
		color: #241f31;
		--palette-light: #fffbf5;
		--palette-dark: #241f31;
		--background-color: #fffbf5;
		--color: #241f31;
		--accent-color: #d4131b;
	}
</style>
