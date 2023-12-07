<script lang="ts">
	import { scale } from 'svelte/transition';
	import NiceBackground from './NiceBackground.svelte';
	import ErrorMessage from './ErrorMessage.svelte';
	import { backOut } from 'svelte/easing';
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';

	export let errorMessage: string;
</script>

<NiceBackground>
	<div
		style:height="100%"
		style:display="flex"
		style:flex-direction="column"
		style:align-items="center"
		style:font-size="x-large"
	>
		<Header />
		<div
			style:flex="1"
			style:display="flex"
			style:align-items="center"
			style:max-width="40ch"
			style:font-size="xx-large"
			style:margin="10px"
			transition:scale={{ delay: 500, duration: 150, easing: backOut }}
		>
			<div>
				<ErrorMessage {errorMessage} />
			</div>
		</div>
		<Footer />
	</div>
</NiceBackground>
