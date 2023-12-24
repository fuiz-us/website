<script lang="ts">
	import '@fontsource/poppins/800.css';
	import '@fontsource/atkinson-hyperlegible';
</script>

<slot />

<style>
	:root {
		--background-color: #fffbf5;
		--color: #241f31;
		--palette-light: #fffbf5;
		--palette-dark: #241f31;
		--accent-color: #d4131b;
		
		@media (prefers-color-scheme: dark) {
			--background-color: #241f31;
			--color: #fffbf5;
		}
	}
	
	:global(body) {
		font-family: 'Atkinson Hyperlegible', sans-serif;
		font-size: 32px;
		color: var(--color);
	}

	:global(html) {
		background: var(--background-color);
	}
</style>
