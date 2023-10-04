<script lang="ts">
	import { palette_light } from '$lib';

	export let text: string;
</script>

<div
	style:display="flex"
	style:justify-content="space-between"
	style:padding="10px"
	style:background={'#000000c0'}
	style:color={palette_light}
	style:border-radius="5px"
	style:font-size="x-large"
>
	<div style:flex="1" style:text-decoration="line-through">
		{text}
	</div>
</div>
