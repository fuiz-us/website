<script lang="ts">
	import { languageTag } from '$lib/paraglide/runtime';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<section>
	<h1>Posts</h1>
	<ul>
		{#each data.posts as post}
			{@const url = `/posts/${post.slug}`}
			<li>
				<a href={url}>
					<div class="image-side">
						<div class="image-container">
							<img src={post.image} alt={post.imageAlt} />
						</div>
					</div>
					<div class="info">
						<h3>{post.title}</h3>
						<p class="description">{post.description}</p>
						<p class="date">
							{post.date.toLocaleDateString(languageTag(), {
								year: 'numeric',
								day: 'numeric',
								month: 'short'
							})}
						</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	h1 {
		text-align: center;
		padding: 0 0.25em;
	}

	ul {
		margin: 1em auto;
		max-width: 35ch;
		padding: 0 0.5em;
	}

	li {
		padding: 0;
		display: block;
	}

	img {
		object-fit: cover;
		height: 100%;
		width: 100%;
	}

	.image-side {
		flex: 1 0 15ch;
	}

	.image-container {
		flex: 1;
		flex-basis: auto;
		height: auto;
		aspect-ratio: 40 / 21;
		border: 0.15em solid;
		border-radius: 0.7em;
		overflow: hidden;
	}

	.info {
		flex: 1 0 15ch;
	}

	a {
		color: inherit;
		text-decoration: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
		justify-content: stretch;
	}

	a:hover h3 {
		text-decoration: underline;
	}

	h3 {
		margin: 0;
	}

	p {
		margin: 0;
	}

	.date {
		opacity: 0.7;
	}
</style>
