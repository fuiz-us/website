import { error } from '@sveltejs/kit';
import { initClient, options } from '../oauthUtil';
import type { PageServerLoad } from './$types';
import { OAUTH_INFO_URL } from '$env/static/private';
import { initializeLucia } from '$lib/auth';

export const load = (async ({ url, cookies, platform }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const db = platform?.env.DATABASE;
	const storedState = cookies.get('oauth_state') ?? null;

	if (!code || !state || !storedState || !db || state !== storedState) error(504, 'no');

	const { clientSecret } = options();

	const oauth2Client = initClient();

	const { access_token } = await oauth2Client.validateAuthorizationCode(code, {
		credentials: clientSecret,
		authenticateWith: 'request_body'
	});

	const oauthUserResponse = await fetch(OAUTH_INFO_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${access_token}`,
			'content-type': 'application/json'
		},
		body: '{"query": "{ me { id name email } }"}'
	});

	const oauthUser: OauthUser = (await oauthUserResponse.json()).me;

	console.log(oauth2Client);

	const lucia = initializeLucia(db);

	const existingUser: OauthUser | null = await db
		.prepare('SELECT * FROM user WHERE id=?')
		.bind(oauthUser.id)
		.first();

	if (existingUser) {
		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	} else {
		const userId = oauthUser.id;

		await db
			.prepare('INSERT INTO user (id, name, email) VALUES (?, ?, ?)')
			.bind(userId, oauthUser.name, oauthUser.email)
			.run();

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	return {};
}) satisfies PageServerLoad;

interface OauthUser {
	id: string;
	email: string;
	name: string;
}
