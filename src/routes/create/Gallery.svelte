<script lang="ts">
	import { palette_light, type ExportedFuiz, play_local } from '$lib';
	import FancyButton from '$lib/FancyButton.svelte';
	import Footer from '$lib/Footer.svelte';
	import Logo from '$lib/Logo.svelte';
	import delete_fuiz from '$lib/assets/delete.svg';
	import play_fuiz from '$lib/assets/play.svg';
	import NiceBackground from '$lib/NiceBackground.svelte';
	import add from '$lib/assets/add.svg';
	import IconButton from '$lib/IconButton.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Icon from '$lib/Icon.svelte';

	export let creations: {
		id: number;
		title: string;
		last_edited: number;
		slides_count: number;
	}[];

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

	function update_localstorage() {
		localStorage.setItem('creations', JSON.stringify(creations.map((c) => c.id)));
	}

	function add_slide() {
		let id = Date.now();

		let new_slide: ExportedFuiz = {
			last_edited: id,
			config: {
				title: 'Untitled',
				slides: []
			}
		};

		localStorage.setItem(id.toString(), JSON.stringify(new_slide));

		creations.push({
			id,
			last_edited: new_slide.last_edited,
			title: new_slide.config.title,
			slides_count: new_slide.config.slides.length
		});

		creations = creations;

		update_localstorage();

		goto('?id=' + id.toString());
	}
</script>

<div>
	<NiceBackground>
		<div style:min-height="100vh" style:display="flex" style:flex-direction="column">
			<div
				style:display="flex"
				style:padding="10px"
				style:margin-bottom="20px"
				style:justify-content="center"
			>
				<a href="{base}/" style:height="65px" style:overflow="hidden">
					<Logo />
				</a>
			</div>
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
					style:max-width="50ch"
					style:padding="10px 10px"
					style:box-sizing="border-box"
					style:margin="20px auto"
					style:font-size="x-large"
					style:background={palette_light + 'E0'}
					style:border="1px solid #00000080"
					style:border-radius="5px"
				>
					<h2 style:margin="5px 0 10px" style:border-bottom="1px solid #00000080">Local Fuizzes</h2>
					<div style:display="flex" style:flex-direction="column">
						{#each sorted_creations as { id, title, last_edited, slides_count }}
							<div
								class="entry"
								style:display="flex"
								style:align-items="center"
								style:border-radius="5px"
							>
								<IconButton
									size="1.4em"
									src={play_fuiz}
									alt="play this fuiz"
									on:click={() => play_local(id)}
								/>
								<a
									href="?id={id}"
									style:padding="8px 10px"
									style:display="flex"
									style:color="inherit"
									style:text-decoration="inherit"
									style:gap="5px"
									style:flex="1"
								>
									<div
										style:flex="1"
										style:font-weight="bold"
										style:max-width="20ch"
										style:word-wrap="anywhere"
									>
										{title}
									</div>
									<div style:opacity="0.7">
										{dateToString(new Date(last_edited))}
									</div>
									<div style:flex="1" style:text-align="end">
										{slides_count} slides
									</div>
								</a>
								<IconButton
									size="1.4em"
									src={delete_fuiz}
									alt="delete this fuiz"
									on:click={() => {
										creations = creations.filter((c) => c.id != id);
										localStorage.removeItem(id.toString());
										update_localstorage();
									}}
								/>
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
	.entry:hover {
		background: #00000040;
	}
</style>
