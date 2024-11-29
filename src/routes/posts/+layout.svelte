<script lang="ts">
	import Footer from '$lib/Footer.svelte';
	import MainHeader from '../MainHeader.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<main>
	<MainHeader />
	<div style:flex="1">
		{@render children?.()}
	</div>
	<footer>
		<Footer />
	</footer>
</main>

<style>
	main {
		background-color: var(--background-color);
		line-height: 1.25;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	div {
		flex: 1;
	}
</style>
