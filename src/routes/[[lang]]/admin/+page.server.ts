import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { R2ObjectBody } from '@cloudflare/workers-types';
import { parse } from '@ltd/j-toml';
import type { OnlineFuiz } from './+page';
import { createFileInGit, updateFileInGit } from '$lib/gitlab';
import { getThumbnail } from '$lib/serverOnlyUtils';

export const load: PageServerLoad = async ({ request, platform }) => {
	const email = request.headers.get('Cf-Access-Authenticated-User-Email');

	if (!email) {
		return error(400, 'not allowed');
	}

	for (;;) {
		await platform?.env.DATABASE.prepare(
			`UPDATE pending_submissions SET assigned = ?1 WHERE assigned IS NULL OR assigned = ?1 ORDER BY assigned NULLS LAST LIMIT 1`
		)
			.bind(email)
			.run();

		const { r2_key, desired_id }: { r2_key: string | undefined; desired_id: string | undefined } =
			(await platform?.env.DATABASE.prepare(
				`SELECT * FROM pending_submissions WHERE assigned = ?1 LIMIT 1`
			)
				.bind(email)
				.first()) || { r2_key: undefined, desired_id: undefined };

		if (!r2_key || !desired_id) return { fuiz: undefined };

		try {
			const fuizBody = await loadStorage(r2_key, platform);
			if (!fuizBody) {
				throw new Error('Fuiz not found in R2 storage');
			}
			const fuizBuf = await fuizBody.arrayBuffer();
			const { author, tags, config, language } = (await parse(fuizBuf, {
				bigint: false
			})) as OnlineFuiz;
			const previous_fuiz =
				desired_id === r2_key
					? undefined
					: await (async () => {
							const fuizBody = await loadStorage(desired_id, platform);
							if (!fuizBody) {
								throw new Error('Fuiz not found in R2 storage');
							}
							const fuizBuf = await fuizBody.arrayBuffer();
							const { author, tags, config, language } = (await parse(fuizBuf, {
								bigint: false
							})) as OnlineFuiz;
							return { author, tags, config: structuredClone(config), language };
					  })();
			return {
				previous_fuiz,
				fuiz: {
					author,
					tags,
					config: structuredClone(config),
					language
				}
			};
		} catch (err) {
			let message = 'Unknown Error';
			if (err instanceof Error) message = err.message;
			await denyWithReason(r2_key, message, 'System', platform);
			continue;
		}
	}
};

async function denyWithReason(
	r2_key: string,
	reason: string,
	by: string,
	platform: App.Platform | undefined
) {
	await platform?.env.DATABASE.prepare(`DELETE FROM pending_submissions WHERE r2_key = ?1`)
		.bind(r2_key)
		.run();

	await platform?.env.DATABASE.prepare(
		`INSERT INTO denied_submissions (r2_key, denied_by, reason) VALUES (?1, ?2, ?3)`
	)
		.bind(r2_key, by, reason)
		.run();
}

async function loadStorage(
	key: string,
	platform: Readonly<App.Platform> | undefined
): Promise<R2ObjectBody | undefined> {
	return (await platform?.env.BUCKET.get(key)) || undefined;
}

export const actions: Actions = {
	approve: async ({ request, platform }) => {
		const email = request.headers.get('Cf-Access-Authenticated-User-Email');

		if (!email) return fail(400, { missing: true });

		const { r2_key, desired_id }: { r2_key: string | undefined; desired_id: string | undefined } =
			(await platform?.env.DATABASE.prepare(
				`DELETE FROM pending_submissions WHERE assigned = ?1 RETURNING r2_key, desired_id`
			)
				.bind(email)
				.first()) || {
				r2_key: undefined,
				desired_id: undefined
			};

		if (!r2_key || !desired_id) return fail(400, { missing: true });

		const fuizBody = await loadStorage(r2_key, platform);

		if (!fuizBody) return fail(400, { missing: true });

		const fuizText = await fuizBody.text();

		const { author, tags, config, language } = parse(fuizText, { bigint: false }) as OnlineFuiz;

		if (desired_id != r2_key) {
			await platform?.env.BUCKET.delete(desired_id);
			await platform?.env.BUCKET.put(desired_id, fuizText);
			await platform?.env.BUCKET.delete(r2_key);
			const gitUrl = await updateFileInGit(desired_id + '.toml', fuizText);
			const { thumbnail, alt } = (await getThumbnail(config)) || {
				thumbnail: null,
				alt: null
			};
			await platform?.env.DATABASE.prepare(
				`UPDATE approved_submissions
					SET title = ?1,
						author = ?2,
						public_url = ?3,
						approved_by = ?4,
						tags = ?5,
						slides_count = ?6,
						thumbnail = ?7,
						alt = ?8,
						last_updated = ?9,
						language = ?10
					WHERE
						r2_key = ?11`
			)
				.bind(
					config.title,
					author,
					gitUrl,
					email,
					tags.join(' ~ '),
					config.slides.length,
					thumbnail,
					alt,
					Date.now(),
					language,
					desired_id
				)
				.run();
		} else {
			const gitUrl = await createFileInGit(r2_key + '.toml', fuizText);
			const { thumbnail, alt } = (await getThumbnail(config)) || {
				thumbnail: null,
				alt: null
			};
			await platform?.env.DATABASE.prepare(
				`INSERT INTO approved_submissions
						(title, author, published, public_url, r2_key, approved_by, tags, slides_count, thumbnail, alt, played_count, last_updated, language)
				VALUES	(?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)`
			)
				.bind(
					config.title,
					author,
					Date.now(),
					gitUrl,
					r2_key,
					email,
					tags.join(' ~ '),
					config.slides.length,
					thumbnail,
					alt,
					0,
					Date.now(),
					language
				)
				.run();
		}

		return { success: true };
	},
	reject: async ({ request, platform }) => {
		const email = request.headers.get('Cf-Access-Authenticated-User-Email');

		if (!email) {
			return fail(400, { missing: true });
		}

		const reason = (await request.formData()).get('reason')?.toString() || null;

		const { r2_key }: { r2_key: string | undefined } = (await platform?.env.DATABASE.prepare(
			`DELETE FROM pending_submissions WHERE assigned = ?1 RETURNING r2_key`
		)
			.bind(email)
			.first()) || {
			r2_key: undefined
		};

		if (!r2_key) {
			return fail(400, { missing: true });
		}

		await platform?.env.DATABASE.prepare(
			`INSERT INTO denied_submissions (r2_key, denied_by, reason) VALUES (?1, ?2, ?3)`
		)
			.bind(r2_key, email, reason)
			.run();

		return { success: true };
	}
};
