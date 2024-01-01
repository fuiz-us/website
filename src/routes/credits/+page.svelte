<script lang="ts">
	import NiceBackground from '$lib/NiceBackground.svelte';
	import computer from '$lib/assets/computer.svg';
	import brush from '$lib/assets/brush.svg';
	import music from '$lib/assets/album.svg';
	import Footer from '$lib/Footer.svelte';
	import AnchorMessage from '$lib/AnchorMessage.svelte';
	import Header from '$lib/Header.svelte';
	import { PUBLIC_PLAY_URL } from '$env/static/public';

	const title = 'Fuiz is Community Made';
	const description = 'Fuiz is made by members of our community and volunteers around the world.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href="{PUBLIC_PLAY_URL}/credits" />
</svelte:head>

<NiceBackground>
	<div
		style:height="100%"
		style:display="flex"
		style:flex-direction="column"
		style:align-items="center"
	>
		<header style:margin="0.5em 0">
			<Header />
		</header>
		<div
			style:flex="1"
			style:display="flex"
			style:flex-direction="column"
			style:gap="5px"
			style:justify-content="center"
			style:align-items="center"
			style:max-width="40ch"
			style:font-size="clamp(1em,4vw,1.25em)"
			style:margin="10px"
		>
			<AnchorMessage
				href="https://adhami.me"
				image={{ src: computer, alt: 'Developer' }}
				background="#23456740"
				message="Khaleel Al-Adhami"
			/>
			<AnchorMessage
				href="https://barish.me/"
				image={{ src: computer, alt: 'Developer' }}
				background="#23456740"
				message="Abutalib (Barish) Namazov"
			/>
			<AnchorMessage
				href="https://bragefuglseth.dev/"
				image={{ src: brush, alt: 'Designer' }}
				background="#23456740"
				message="Brage Fuglseth"
			/>
			<AnchorMessage
				href="https://incompetech.com/wordpress/"
				image={{ src: music, alt: 'Music' }}
				background="#23456740"
				message={'"Thinking Music" Kevin MacLeod (incompetech.com). Licensed under Creative Commons: By Attribution 4.0 License. http://creativecommons.org/licenses/by/4.0/'}
			/>
			<AnchorMessage
				href="https://www.youtube.com/watch?v=_h47TNIKJYo&pp=ygUHIGJlZS4gMw%3D%3D"
				image={{ src: music, alt: 'Music' }}
				background="#23456740"
				message={'"bee. 3" GroovyDominoes52. can use in your videos or games but always remember to credit and not steal'}
			/>
		</div>
		<Footer />
	</div>
</NiceBackground>
