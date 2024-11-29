<script lang="ts">
	import logo from '$lib/assets/logo.svg';
	import { inlineSvg } from '@svelte-put/inline-svg';

	interface Props {
		height?: number;
	}

	let { height = 60 }: Props = $props();
</script>

<div style:height="100%" style:display="flex" style:aspect-ratio="11/4">
	<div style:margin-right="auto" style:display="flex" style:width="auto" style:height="{height}px">
		<svg height="100%" use:inlineSvg={logo} />
	</div>
</div>
