import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PublishedFuizDB } from '$lib/types';
import { env } from '$env/dynamic/private';

export const prerender = false;

export const load = (async ({ locals }) => {
	const session = await locals.auth();

	if (!session?.user?.id) redirect(303, '/signin');

	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	request_publish: async ({ request, platform, locals }) => {
		const session = await locals.auth();

		if (!session?.user?.id) return fail(401, { missing: true });

		const data = await request.formData();
		const config = data.get('config');

		if (!config) return fail(400, { missing: true });

		const id = crypto.randomUUID();

		await platform?.env.BUCKET.put(id, config.toString());
		await platform?.env.DATABASE.prepare(
			'INSERT INTO pending_submissions (storage_id, desired_id, creator) VALUES (?1, ?1, ?2)'
		)
			.bind(id, session.user.id)
			.run();

		await fetch(`${env.WALLO_ORIGIN}/api/v0/requestPublication`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${env.WALLO_CLIENT_SECRET}`
			},
			body: JSON.stringify({ id, clientId: env.WALLO_CLIENT_ID, kind: 'content' })
		});

		return { r2_key: id };
	},
	check_publish: async ({ request, platform, locals }) => {
		const session = await locals.auth();

		if (!session?.user?.id) return fail(401, { missing: true });

		const data = await request.formData();
		const key = data.get('r2_key');

		if (!key) return fail(400, { missing: true });

		const pendingRes = await platform?.env.DATABASE.prepare(
			'SELECT * FROM pending_submissions WHERE storage_id = ?1'
		)
			.bind(key)
			.first();

		if (pendingRes) return { status: 'pending' };

		const deniedRes = await platform?.env.DATABASE.prepare(
			'SELECT reason FROM denied_submissions WHERE storage_id = ?1'
		)
			.bind(key)
			.first();

		if (deniedRes) return { status: 'denied', reason: deniedRes.reason };
		return { status: 'approved' };
	},
	request_update: async ({ request, platform, locals }) => {
		const session = await locals.auth();

		if (!session?.user?.id) return fail(401, { missing: true });

		const data = await request.formData();
		const config = data.get('config');
		const desiredId = data.get('id');

		if (!config || !desiredId) return fail(400, { missing: true });

		const existingOne = await platform?.env.DATABASE.prepare(
			'SELECT * FROM approved_submissions WHERE storage_id = ?1'
		)
			.bind(desiredId)
			.first<PublishedFuizDB>();

		if (!existingOne) return fail(400, { missing: true });

		const id = crypto.randomUUID();

		await platform?.env.BUCKET.put(id, config.toString());
		await platform?.env.DATABASE.prepare(
			'INSERT INTO pending_submissions (storage_id, desired_id, creator) VALUES (?1, ?2, ?3)'
		)
			.bind(id, desiredId, session.user.id)
			.run();

		await fetch(`${env.WALLO_ORIGIN}/api/v0/requestPublication`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${env.WALLO_CLIENT_SECRET}`
			},
			body: JSON.stringify({ id, clientId: env.WALLO_CLIENT_ID, kind: 'content' })
		});

		return { r2_key: id };
	}
};
