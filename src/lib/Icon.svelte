<script lang="ts">
	export let src: string;
	export let alt: string;
	export let size: string;

	$: url_string = `url("${src}")`;
</script>

<div
	style:width={size}
	style:height={size}
	style:aspect-ratio="1/1"
	style:display="flex"
	style:-webkit-mask-size="cover"
	style:color="inherit"
	style:background="currentColor"
	style:mask-image={url_string}
	style:mask-position="center"
	style:mask-size="contain"
	style:mask-repeat="no-repeat"
	style:-webkit-mask-image={url_string}
	title={alt}
/>
