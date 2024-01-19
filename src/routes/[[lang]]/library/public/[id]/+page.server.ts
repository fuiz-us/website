import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fixPublish } from '$lib/serverOnlyUtils';
import type { PublishedFuizDB } from '$lib/types';
import { parse } from '@ltd/j-toml';
import type { OnlineFuiz } from '../../../admin/+page';

export const load = (async ({ params, platform }) => {
	const published: PublishedFuizDB | undefined =
		(await platform?.env.DATABASE.prepare('SELECT * FROM approved_submissions WHERE id = ?1')
			.bind(parseInt(params.id))
			.first()) || undefined;

	if (!published) {
		error(404, 'fuiz was not found');
	}

	const fuiz = fixPublish(published);

	const { config } = parse(await (await fetch(fuiz.public_url)).text(), {
		bigint: false
	}) as OnlineFuiz;

	return {
		fuiz,
		config: structuredClone(config)
	};
}) satisfies PageServerLoad;
