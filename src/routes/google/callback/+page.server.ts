import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { options, scope } from '../googleUtil';
import type { PageServerLoad } from './$types';
import type { OAuthTokens } from 'worker-auth-providers';

async function getTokensFromCode(code: string): Promise<OAuthTokens> {
	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			accept: 'application/json'
		},
		body: JSON.stringify({
			client_id: options.clientId,
			client_secret: options.clientSecret,
			redirect_uri: options.redirectUri,
			scope,
			code,
			grant_type: 'authorization_code'
		})
	});

	const result = await response.json();

	if (result.error) {
		throw new Error(result.error_description);
	}

	return result;
}

export const load = (async ({ url, cookies }) => {
	const code = url.searchParams.get('code');

	if (!code) error(504, 'no');

	cookies.set('google', JSON.stringify(await getTokensFromCode(code)), {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev,
		maxAge: 60 * 60 * 24 * 30
	});

	return {};
}) satisfies PageServerLoad;
