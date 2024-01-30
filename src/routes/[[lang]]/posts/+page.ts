import { type MdPost, type Metadata } from './lib';

export const prerender = true;

async function getPosts() {
	let posts: MdPost[] = [];

	const paths = import.meta.glob('./*/+page.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-2);

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Metadata;
			const post = { ...metadata, slug } satisfies MdPost;
			post.published && posts.push(post);
		}
	}

	posts = posts.sort((first, second) => second.date.getTime() - first.date.getTime());

	return posts;
}

export async function load() {
	return { posts: await getPosts() };
}
