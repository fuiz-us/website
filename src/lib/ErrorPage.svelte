<script lang="ts">
	import { scale } from 'svelte/transition';
	import NiceBackground from './NiceBackground.svelte';
	import ErrorMessage from './ErrorMessage.svelte';
	import { backOut } from 'svelte/easing';
	import Footer from './Footer.svelte';
	import Logo from './Logo.svelte';
	import { base } from '$app/paths';

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
		<a href="{base}/" style:height="100px" style:margin="10px 0 40px" style:overflow="hidden">
			<Logo />
		</a>
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
