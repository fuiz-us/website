<script>
	import Footer from '$lib/Footer.svelte';
	import MainHeader from '../MainHeader.svelte';
</script>

<main>
	<MainHeader />
	<div>
		<slot />
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
