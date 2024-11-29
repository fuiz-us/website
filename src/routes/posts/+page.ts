import { type MdPost, type Metadata } from './lib';

function getPosts() {
	let posts: MdPost[] = [];

	const paths = import.meta.glob('./*/+page.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-2);

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Metadata;
			const post = { ...metadata, slug } satisfies MdPost;
			if (post.published) {
				posts.push(post);
			}
		}
	}

	posts = posts.toSorted((first, second) => second.date.getTime() - first.date.getTime());

	return posts;
}

export function load() {
	return { posts: getPosts() };
}
