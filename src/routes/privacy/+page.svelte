<script>
	import Anchor from '$lib/Anchor.svelte';
	import Footer from '$lib/Footer.svelte';
	import MainHeader from '../MainHeader.svelte';
</script>

<main>
	<MainHeader />
	<section>
		<h1>Privacy Policy</h1>
		<p>
			It's really simple. We do not collect any personal, sensitive, nor identifiable information.
			We do not track you.
		</p>
		<p>
			Any data we process is only stored temporarily on volatile memory and will be erased
			automaticly after it gets processed.
		</p>
		<p>
			We might use cookies to better enhance your experience on the website. Those will not include
			any related to advertisement nor tracking.
		</p>
		<p>
			If you have any questions, email us at <Anchor href="mailto:info@fuiz.us">info@fuiz.us</Anchor
			>.
		</p>
	</section>
	<footer>
		<Footer />
	</footer>
</main>

<style>
	section {
		padding: 0.5em;
	}
</style>
