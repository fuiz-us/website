<script lang="ts">
	import * as m from '$paraglide/messages';

	import warning from '$lib/assets/warning.svg';
	import Message from './Message.svelte';

	export let errorMessage: string;
</script>

<Message
	message={errorMessage}
	background="#e01b2430"
	color="#e01b24"
	image={{ src: warning, alt: m.error_alt() }}
/>
