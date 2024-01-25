<script lang="ts">
	import { route } from '$lib/i18n-routing';
	import { languageTag } from '$paraglide/runtime';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section>
	<h1>Posts</h1>
	<ul>
		{#each data.posts as post}
			{@const url = `/posts/${post.slug}`}
			<li>
				<a href={route(url, languageTag())}>
					<img src={post.image} alt={post.imageAlt} />
					<div>
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
		margin: 0 auto;
		max-width: 35ch;
		padding: 0.5em;
	}

	li {
		padding: 0;
		display: block;
	}

	img {
		flex: 1;
		width: 7em;
		height: auto;
		aspect-ratio: 40 / 21;
		object-fit: cover;
		border: 0.15em solid;
		border-radius: 0.7em;
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
