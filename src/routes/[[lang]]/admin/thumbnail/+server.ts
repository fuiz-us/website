import { parse } from '@ltd/j-toml';
import type { RequestHandler } from './$types';
import type { OnlineFuiz } from '../+page';
import { getThumbnail } from '$lib/gitlab';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, platform }) => {
	const email = request.headers.get('Cf-Access-Authenticated-User-Email');

	if (!email) {
		return error(400, 'not allowed');
	}

	const { r2_key }: { r2_key: string | undefined } = (await platform?.env.DATABASE.prepare(
		`SELECT * FROM pending_submissions WHERE assigned = ?1 LIMIT 1`
	)
		.bind(email)
		.first()) || { r2_key: undefined };

	if (!r2_key) error(400, 'not allowed');

	const fuizBody = (await platform?.env.BUCKET.get(r2_key)) || undefined;

	if (!fuizBody) error(401, 'not allowed');

	const res = await fuizBody.text();

	const { config } = parse(res, { bigint: false }) as OnlineFuiz;

	return new Response((await getThumbnail(config))?.thumbnail);
};
