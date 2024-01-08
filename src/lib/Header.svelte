<script>
	import { languageTag } from '$paraglide/runtime';
	import Logo from './Logo.svelte';
	import { route } from './i18n-routing';
</script>

<div style:display="flex" style:justify-content="center">
	<a href={route('/', languageTag())} style:height="60px" style:overflow="hidden">
		<Logo height={60} width={150} />
	</a>
</div>
