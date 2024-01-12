<script lang="ts">
	import * as m from '$paraglide/messages';

	import FancyButton from '$lib/FancyButton.svelte';
	import Textfield from '$lib/Textfield.svelte';
	import { beforeUpdate } from 'svelte';
	import { backIn, backOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let tags: string[];

	beforeUpdate(() => {
		if (tags.length > 1) {
			const start = tags.slice(undefined, -1);
			const end = tags.slice(-1);
			tags = [...start.filter((e) => e.length), ...end];
		}
	});
</script>

{#each tags as tag, index}
	<Textfield
		id="tag{index}"
		placeholder={m.tag()}
		required={false}
		disabled={false}
		bind:value={tag}
	/>
{/each}
{#if tags.length == 0 || tags.at(-1)}
	<div in:scale={{ easing: backOut, duration: 300 }} out:scale={{ easing: backIn, duration: 300 }}>
		<FancyButton
			type="button"
			on:click={() => {
				tags.push('');
				tags = tags;
			}}
		>
			{m.add_tag()}
		</FancyButton>
	</div>
{/if}
