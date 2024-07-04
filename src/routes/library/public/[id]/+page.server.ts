import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fixPublish } from '$lib/serverOnlyUtils';
import type { OnlineFuiz, PublishedFuizDB } from '$lib/types';
import { parse } from '@ltd/j-toml';

export const load = (async ({ params, platform }) => {
	const published: PublishedFuizDB | undefined =
		(await platform?.env.DATABASE.prepare(
			'SELECT * FROM approved_submissions WHERE storage_id = ?1'
		)
			.bind(params.id)
			.first()) || undefined;

	if (!published) {
		error(404, 'fuiz was not found');
	}

	const fuiz = fixPublish(published);

	const fuizText = await (await platform?.env.BUCKET.get(params.id))?.text();

	if (!fuizText) {
		error(500, 'fuiz file not found');
	}

	const { config } = parse(fuizText, {
		bigint: false
	}) as OnlineFuiz;

	return {
		fuiz,
		config: structuredClone(config)
	};
}) satisfies PageServerLoad;
