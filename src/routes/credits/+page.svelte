<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	import computer from '$lib/assets/computer.svg';
	import people from '$lib/assets/email.svg';
	import translator from '$lib/assets/language.svg';
	import brush from '$lib/assets/brush.svg';
	import music from '$lib/assets/album.svg';
	import AnchorMessage from '$lib/AnchorMessage.svelte';
	import { PUBLIC_PLAY_URL } from '$env/static/public';
	import TypicalPage from '$lib/TypicalPage.svelte';
	import { i18n } from '$lib/i18n';

	const title = m.credits_title();
	const description = m.credits_desc();
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<link rel="canonical" href="{PUBLIC_PLAY_URL}{i18n.resolveRoute('/credits')}" />
</svelte:head>

<TypicalPage>
	<div
		style:height="100%"
		style:display="flex"
		style:flex-direction="column"
		style:gap="5px"
		style:justify-content="center"
		style:align-items="center"
		style:max-width="40ch"
		style:font-size="clamp(1em,4vw,1.25em)"
		style:margin="auto"
	>
		<AnchorMessage
			href="https://adhami.me"
			image={{ src: computer, alt: m.developer() }}
			background="#23456740"
			message="Khaleel Al-Adhami"
		/>
		<AnchorMessage
			href="https://www.linkedin.com/in/yichen-gao/"
			image={{ src: people, alt: 'Community Lead' }}
			background="#23456740"
			message="Yichen Gao"
		/>
		<AnchorMessage
			href="https://barish.me/"
			image={{ src: computer, alt: m.developer() }}
			background="#23456740"
			message="Abutalib (Barish) Namazov"
		/>
		<AnchorMessage
			href="https://bragefuglseth.dev/"
			image={{ src: brush, alt: m.designer() }}
			background="#23456740"
			message="Brage Fuglseth"
		/>
		<AnchorMessage
			href="https://www.linkedin.com/in/zhironwu/"
			image={{ src: translator, alt: 'Translator' }}
			background="#23456740"
			message="Zhiron Wu"
		/>
		<AnchorMessage
			href="https://incompetech.com/wordpress/"
			image={{ src: music, alt: m.music() }}
			background="#23456740"
			message={'"Thinking Music" Kevin MacLeod (incompetech.com). Licensed under Creative Commons: By Attribution 4.0 License. http://creativecommons.org/licenses/by/4.0/'}
		/>
		<AnchorMessage
			href="https://www.youtube.com/watch?v=_h47TNIKJYo&pp=ygUHIGJlZS4gMw%3D%3D"
			image={{ src: music, alt: m.music() }}
			background="#23456740"
			message={'"bee. 3" GroovyDominoes52. can use in your videos or games but always remember to credit and not steal'}
		/>
	</div>
</TypicalPage>
