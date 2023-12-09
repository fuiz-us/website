<script>
	import { base } from '$app/paths';
	import Logo from './Logo.svelte';
</script>

<div
	style:display="flex"
	style:padding="10px 0"
	style:justify-content="center"
	style:margin-bottom="10px"
>
	<a href="{base}/" style:height="60px" style:overflow="hidden">
		<Logo height={60} width={150} />
	</a>
</div>
