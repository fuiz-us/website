import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	request_publish: async ({ request, platform }) => {
		const data = await request.formData();
		const config = data.get('config');

		if (!config) return fail(400, { missing: true });

		const id = crypto.randomUUID();

		await platform?.env.BUCKET.put(id, config.toString());
		await platform?.env.DATABASE.prepare(
			'INSERT INTO pending_submissions (id, assigned, desired_id, r2_key) VALUES (NULL, NULL, ?1, ?1)'
		)
			.bind(id)
			.run();

		return { r2_key: id };
	},
	check_publish: async ({ request, platform }) => {
		const data = await request.formData();
		const key = data.get('r2_key');

		if (!key) return fail(400, { missing: true });

		const pendingRes = await platform?.env.DATABASE.prepare(
			'SELECT * FROM pending_submissions WHERE r2_key = ?1'
		)
			.bind(key)
			.first();

		if (pendingRes) return { status: 'pending' };

		const deniedRes = await platform?.env.DATABASE.prepare(
			'SELECT reason FROM denied_submissions WHERE r2_key = ?1'
		)
			.bind(key)
			.first();

		if (deniedRes) return { status: 'denied', reason: deniedRes.reason };
		return { status: 'approved' };
	},
	request_update: async ({ request, platform }) => {
		const data = await request.formData();
		const config = data.get('config');
		const desired_id = data.get('id');

		if (!config || !desired_id) return fail(400, { missing: true });

		const id = crypto.randomUUID();

		await platform?.env.BUCKET.put(id, config.toString());
		await platform?.env.DATABASE.prepare(
			'INSERT INTO pending_submissions (id, assigned, desired_id, r2_key) VALUES (NULL, NULL, ?1, ?2)'
		)
			.bind(desired_id, id)
			.run();

		return { success: true };
	}
};
