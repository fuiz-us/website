<script>
	import Logo from './Logo.svelte';
	import { i18n } from './i18n';
</script>

<div style:display="flex" style:justify-content="center">
	<a
		href={i18n.resolveRoute('/')}
		style:height="60px"
		style:overflow="hidden"
		style:color="inherit"
	>
		<Logo height={60} />
	</a>
</div>
