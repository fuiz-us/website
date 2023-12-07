<script lang="ts">
	import { palette_light, type ExportedFuiz, play_local, type Media } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import Footer from '$lib/Footer.svelte';
	import delete_fuiz from '$lib/assets/delete.svg';
	import present from '$lib/assets/present.svg';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import add from '$lib/assets/add.svg';
	import IconButton from '$lib/IconButton.svelte';
	import { goto } from '$app/navigation';
	import Icon from '$lib/Icon.svelte';
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
			<Header />
			<div style:display="flex" style:justify-content="center">
				<div>
					<FancyButton on:click={add_slide}>
						<div
							style:display="flex"
							style:align-items="center"
							style:font-size="xx-large"
							style:font-weight="bolder"
							style:gap="0.5em"
							style:padding="0.15em 0.25em"
							style:justify-content="center"
						>
							<Icon size="1em" src={add} alt="add a new one" />
							<div>Start Blank</div>
						</div>
					</FancyButton>
				</div>
			</div>
			<div style:flex="1" style:margin="0 10px">
				<div
					style:max-width="100ch"
					style:padding="15px"
					style:box-sizing="border-box"
					style:margin="20px auto"
					style:background={palette_light + 'E0'}
					style:border="2px solid #00000080"
					style:border-radius="10px"
				>
					<h2
						style:font-family="Poppins"
						style:font-size="xx-large"
						style:line-height="1"
						style:margin="0 0 15px"
						style:border-bottom="1px solid #00000080"
					>
						Recent Fuizzes
					</h2>
					<div
						style:display="grid"
						style:grid-template-columns="repeat(auto-fit, minmax(200px, 1fr))"
						style:grid-auto-rows="1fr"
						style:grid-gap="10px"
					>
						{#each sorted_creations as { id, title, last_edited, slides_count, media }}
							<div
								class="entry"
								style:background="var(--accent-color)"
								style:display="flex"
								style:max-height="300px"
								style:aspect-ratio="6 / 5"
								style:border-radius="5px"
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
									style:border-radius="5px"
									style:overflow="hidden"
									style:border="2px solid var(--border-color)"
								>
									<div
										style:width="100%"
										style:flex="1"
										style:border-bottom="2px solid var(--border-color)"
										style:position="relative"
									>
										<MediaContainer {media} fit="cover" />
									</div>
									<div style:padding="8px 10px" style:font-size="20px">
										<div style:display="flex" style:align-items="center" style:gap="5px">
											<div style:flex="1" style:word-wrap="anywhere">
												{title}
											</div>
										</div>
										<div style:display="flex" style:align-items="center">
											<div style:display="flex" style:gap="5px" style:flex="1" style:opacity="0.7">
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
									style:padding="5px"
									style:gap="5px"
									style:color="var(--palette-light)"
								>
									<IconButton
										size="24px"
										src={present}
										alt="Host This Fuiz"
										on:click={() => play_local(id, db)}
									/>
									<IconButton
										size="24px"
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
				</div>
			</div>
			<Footer />
		</div>
	</NiceBackground>
</div>

<style>
	.entry .main {
		--border-color: #a0a0a0;

		transition: margin-right 150ms ease-out;
		outline: none;
		background: var(--palette-light);
	}

	.entry:where(:focus-within, :hover) .main {
		&:where(:focus, :hover) {
			background: linear-gradient(#00000020, #00000020), var(--palette-light);
		}

		--border-color: var(--accent-color);
		margin-right: 34px;
	}

	@media (hover: none) {
		.entry .main {
			--border-color: var(--accent-color);
			outline: none;
			margin-right: 34px;
		}
	}
</style>
