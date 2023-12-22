<script lang="ts">
	export let href: string;
</script>

<a
	{href}
	target="_blank"
	style:text-decoration="none"
	style:background="color-mix(in srgb, currentColor 20%, transparent)"
	style:color="inherit"
	style:padding="0 10px"
	style:border-radius="5px"
>
	<slot />
</a>
