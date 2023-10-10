<script lang="ts">
	export let src: string;
	export let alt: string;
	export let size: string;
</script>

<div
	style:width={size}
	style:aspect-ratio="1/1"
	style:display="flex"
	style:mask-size="cover"
	style:-webkit-mask-size="cover"
	style:color="inherit"
	style:background="currentColor"
	style:mask-image="url({src})"
	style:-webkit-mask-image="url({src})"
	title={alt}
/>
