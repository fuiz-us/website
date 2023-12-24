<script lang="ts">
	import { type ExportedFuiz, play_local, type Media } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import Footer from '$lib/Footer.svelte';
	import delete_fuiz from '$lib/assets/delete.svg';
	import present from '$lib/assets/present.svg';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import add from '$lib/assets/add.svg';
	import IconButton from '$lib/IconButton.svelte';
	import { goto } from '$app/navigation';
	import Icon from '$lib/Icon.svelte';
	import ghost from '$lib/assets/ghost.svg';
	import Header from '$lib/Header.svelte';
	import MediaContainer from '$lib/MediaContainer.svelte';

	export let creations: {
		id: number;
		title: string;
		last_edited: number;
		slides_count: number;
		media?: Media;
	}[];

	export let db: IDBDatabase;

	$: sorted_creations = creations.sort((a, b) => b.last_edited - a.last_edited);

	const same_year = { month: 'short', day: 'numeric' } as const;
	const diff_year = { year: 'numeric', month: 'numeric', day: 'numeric' } as const;

	function dateToString(date: Date): string {
		let currentDate = new Date();
		if (currentDate.getFullYear() == date.getFullYear()) {
			return date.toLocaleDateString(undefined, same_year);
		} else {
			return date.toLocaleDateString(undefined, diff_year);
		}
	}

	function add_slide() {
		let new_slide: ExportedFuiz = {
			last_edited: Date.now(),
			config: {
				title: 'Untitled',
				slides: []
			}
		};

		const creationsStore = db.transaction(['creations'], 'readwrite').objectStore('creations');

		const request = creationsStore.put(new_slide);

		request.addEventListener('success', () => {
			const id = request.result;

			creations.push({
				id: parseInt(id.toString()),
				last_edited: new_slide.last_edited,
				title: new_slide.config.title,
				slides_count: new_slide.config.slides.length
			});

			creations = creations;

			goto('?id=' + id.toString());
		});
	}

	function delete_slide(id: number) {
		const creationsStore = db.transaction(['creations'], 'readwrite').objectStore('creations');

		const request = creationsStore.delete(id);

		request.addEventListener('success', () => {
			creations = creations.filter((c) => c.id != id);
		});
	}
</script>

<div>
	<NiceBackground>
		<div style:min-height="100vh" style:display="flex" style:flex-direction="column">
			<header style:margin="0.2em 0">
				<Header />
			</header>
			<div style:display="flex" style:justify-content="center">
				<div>
					<FancyButton on:click={add_slide}>
						<div
							style:display="flex"
							style:align-items="center"
							style:font-family="Poppins"
							style:gap="0.2em"
							style:padding="0.15em 0.25em"
							style:justify-content="center"
						>
							<Icon size="1.25em" src={add} alt="add a new one" />
							<div>Start Blank</div>
						</div>
					</FancyButton>
				</div>
			</div>
			<div style:flex="1" style:margin="0 0.4em">
				<div
					style:max-width="60ch"
					style:padding="0.5em"
					style:box-sizing="border-box"
					style:margin="1em auto"
					style:background="color-mix(in srgb, currentColor 20%, transparent)"
					style:border="0.1em solid color-mix(in srgb, currentColor 80%, transparent)"
					style:border-radius="0.7em"
				>
					<h2
						style:font-family="Poppins"
						style:line-height="1"
						style:margin="0 0 0.2em"
						style:border-bottom="0.05em solid color-mix(in srgb, currentColor 80%, transparent)"
					>
						Recent Fuizzes
					</h2>
					{#if sorted_creations.length}
						<div
							style:display="grid"
							style:grid-template-columns="repeat(auto-fit, minmax(15ch, 1fr))"
							style:grid-auto-rows="1fr"
							style:grid-gap="0.4em"
						>
							{#each sorted_creations as { id, title, last_edited, slides_count, media }}
								<div
									class="entry"
									style:display="flex"
									style:max-height="20ch"
									style:aspect-ratio="6 / 5"
									style:border="0.15em solid var(--border-color)"
									style:border-radius="0.7em"
									style:position="relative"
									style:overflow="hidden"
									style:left="50%"
									style:transform="translateX(-50%)"
								>
									<a
										style:flex="1"
										href="?id={id}"
										style:z-index="1"
										class="main"
										style:color="inherit"
										style:text-decoration="inherit"
										style:display="flex"
										style:flex-direction="column"
										style:border-radius="0.6em"
										style:overflow="hidden"
									>
										<div
											style:width="100%"
											style:flex="1"
											style:border-bottom="0.15em solid var(--border-color)"
											style:position="relative"
										>
											<MediaContainer {media} fit="cover" />
										</div>
										<div style:padding="0.3em 0.4em" style:font-size="0.75em">
											<div style:display="flex" style:align-items="center" style:gap="0.2em">
												<div style:flex="1" style:word-wrap="anywhere">
													{title}
												</div>
											</div>
											<div style:display="flex" style:align-items="center">
												<div
													style:display="flex"
													style:gap="0.25em"
													style:flex="1"
													style:opacity="0.7"
												>
													<div>
														{dateToString(new Date(last_edited))}
													</div>
													<div>•</div>
													<div style:flex="1" style:text-align="start">
														{slides_count} slides
													</div>
												</div>
											</div>
										</div>
									</a>
									<div
										class="panel"
										style:position="absolute"
										style:right="0"
										style:height="100%"
										style:z-index="0"
										style:display="flex"
										style:flex-direction="column"
										style:padding="0.2em"
										style:gap="0.2em"
									>
										<IconButton
											size="1em"
											src={present}
											alt="Host This Fuiz"
											on:click={() => play_local(id, db)}
										/>
										<IconButton
											size="1em"
											src={delete_fuiz}
											alt="Delete This Fuiz"
											on:click={() => {
												delete_slide(id);
											}}
										/>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div
							style:display="flex"
							style:flex-direction="column"
							style:align-items="center"
							style:opacity="0.3"
						>
							<Icon src={ghost} size="min(20vh, 60vw)" alt="Nothing Here" />
							Nothing
						</div>
					{/if}
				</div>
			</div>
			<Footer />
		</div>
	</NiceBackground>
</div>

<style>
	.entry {
		--border-color: #a0a0a0;
		background: var(--border-color);

		& .main {
			transition: margin-right 150ms ease-out;
			outline: none;
			background: var(--background-color);
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
