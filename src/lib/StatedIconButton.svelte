<script lang="ts">
	import IconButton from './IconButton.svelte';

	interface Props {
		icons: [{ src: string; alt: string }, { src: string; alt: string }];
		size: string;
		state: boolean;
		onchange?: (state: boolean) => void;
	}

	let { icons, size, state = $bindable(), onchange }: Props = $props();

	let icon = $derived(icons[state ? 1 : 0]);
</script>

<IconButton
	src={icon.src}
	alt={icon.alt}
	{size}
	onclick={() => {
		state = !state;
		if (onchange) onchange(state);
	}}
/>
