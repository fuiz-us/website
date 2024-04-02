<script lang="ts">
	import * as m from '$paraglide/messages';

	import delete_fuiz from '$lib/assets/delete.svg';
	import present from '$lib/assets/slideshow.svg';
	import IconButton from '$lib/IconButton.svelte';
	import MediaContainer from '$lib/MediaContainer.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Media } from '$lib/types';
	import { languageTag } from '$paraglide/runtime';

	const dispatch = createEventDispatcher<{
		delete: undefined;
		play: undefined;
		download: undefined;
		publish: undefined;
	}>();

	export let id: number,
		title: string,
		lastEdited: number,
		slidesCount: number,
		media: Media | undefined;

	const same_year = { month: 'short', day: 'numeric' } as const;
	const diff_year = { year: 'numeric', month: 'numeric', day: 'numeric' } as const;

	function dateToString(date: Date): string {
		let currentDate = new Date();
		if (currentDate.getFullYear() == date.getFullYear()) {
			return date.toLocaleDateString(languageTag(), same_year);
		} else {
			return date.toLocaleDateString(languageTag(), diff_year);
		}
	}
</script>

<div class="entry">
	<a class="main" href="?id={id}">
		<div class="media">
			<MediaContainer {media} fit="cover" />
		</div>
		<div class="info">
			{title}
			<div class="desc">
				{dateToString(new Date(lastEdited))} • {m.slides_count({
					count: slidesCount
				})}
			</div>
		</div>
	</a>
	<div class="panel">
		<IconButton size="1em" src={present} alt={m.host()} on:click={() => dispatch('play')} />
		<IconButton
			size="1em"
			src={delete_fuiz}
			alt={m.delete_confirm()}
			on:click={() => dispatch('delete')}
		/>
		<IconButton
			size="1em"
			src="$lib/assets/download.svg"
			alt={m.download()}
			on:click={() => dispatch('download')}
		/>
		<IconButton
			size="1em"
			src="$lib/assets/publish.svg"
			alt={m.publish_title}
			on:click={() => dispatch('publish')}
		/>
	</div>
</div>

<style>
	.entry {
		--border-color: #a0a0a0;
		background: var(--border-color);

		display: flex;
		max-height: 15ch;
		aspect-ratio: 6 / 5;
		border: 0.15em solid var(--border-color);
		border-radius: 0.7em;
		position: relative;
		overflow: hidden;
		left: 50%;
		transform: translateX(-50%);

		transition: background 150ms ease-out, border 150ms ease-out;

		& .main {
			transition: margin-right 150ms ease-out, background 150ms ease-out;
			outline: none;
			background: var(--background-color);

			flex: 1;
			z-index: 1;
			color: inherit;
			text-decoration: inherit;
			display: flex;
			flex-direction: column;
			border-radius: 0.6em;
			overflow: hidden;

			& .media {
				width: 100%;
				flex: 1;
				border-bottom: 0.15em solid var(--border-color);

				transition: border-color 150ms ease-out;
				position: relative;
			}

			& .info {
				padding: 0.3em 0.4em;
				font-size: 0.75em;
				word-wrap: break-word;

				& .desc {
					opacity: 0.7;
				}
			}
		}

		& .panel {
			position: absolute;
			right: 0;
			height: 100%;
			z-index: 0;
			color: var(--palette-light);

			display: flex;
			flex-direction: column;
			padding: 0.2em;
			gap: 0.2em;
		}

		&:where(:focus-within, :hover) {
			background: var(--accent-color);
			--border-color: var(--accent-color);

			& .main {
				margin-right: 1.5em;

				&:where(:focus, :hover) {
					--trans-color: color-mix(in srgb, currentColor 10%, transparent);
					background: linear-gradient(var(--trans-color), var(--trans-color)),
						var(--background-color);
				}
			}
		}
	}

	@media (hover: none) {
		.entry {
			--border-color: var(--accent-color);
		}

		.entry .main {
			outline: none;
			margin-right: 1.5em;
		}
	}
</style>
