<script lang="ts">
	export let href: string;
</script>

<a {href} target="_blank">
	<slot />
</a>

<style>
	a {
		text-decoration: none;
		--highlight: color-mix(in srgb, currentColor 20%, transparent);
		background: var(--highlight);
		color: inherit;
		padding: 0 0.15em;
		border-radius: 0.15em;
		font-weight: bold;
	}

	a:focus,
	a:hover {
		outline: 0.15em solid var(--highlight);
		text-decoration: underline solid;
	}
</style>
