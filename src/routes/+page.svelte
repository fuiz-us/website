<script lang="ts">
	import { palette_light } from '$lib';
	import ErrorMessage from '$lib/ErrorMessage.svelte';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import logo from '$lib/assets/logo.svg';
</script>

<NiceBackground>
	<div style:display="flex" style:flex-direction="column">
		<div
			style:height="100vh"
			style:display="flex"
			style:flex-direction="column"
			style:align-items="center"
			style:justify-content="center"
			style:padding="0 10px"
			style:gap="10px"
		>
			<img
				src={logo}
				alt="a deck of cards representing fuiz logo and the word fuiz"
				width="500px"
				height="200px"
				style:max-width="100%"
				style:padding-right="48px"
				style:display="block"
				style:box-sizing="border-box"
			/>
			<div style:text-align="center" style:font-family="Poppins" style:font-size="xxx-large">
				Host live quizzes freely
			</div>
			<div style:font-size="x-large" style:max-width="50ch">
				<ErrorMessage
					errorMessage="Fuiz is under development. Check here later once we're ready!"
				/>
			</div>
		</div>
	</div>
</NiceBackground>
