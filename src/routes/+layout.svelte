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
		--background-color: #fffbf5;
		--color: #241f31;
		color: var(--color);
		--palette-light: #fffbf5;
		--palette-dark: #241f31;
		--accent-color: #d4131b;

		@media (prefers-color-scheme: dark) {
			--background-color: #241f31;
			--color: #fffbf5;
		}
	}
</style>
