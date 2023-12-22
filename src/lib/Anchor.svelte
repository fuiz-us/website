<script lang="ts">
	export let href: string;
</script>

<a {href} target="_blank">
	<slot />
</a>

<style>
	a {
		text-decoration: none;
		background: color-mix(in srgb, currentColor 20%, transparent);
		color: inherit;
		padding: 0 10px;
		border-radius: 5px;
		font-weight: bold;
	}
</style>
