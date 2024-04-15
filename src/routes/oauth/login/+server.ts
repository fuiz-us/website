import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { initClient } from '../oauthUtil';

import { generateState } from 'oslo/oauth2';

export const GET: RequestHandler = async ({ cookies }) => {
	const oauth2Client = initClient();

	const state = generateState();
	const url = await oauth2Client.createAuthorizationURL({
		state,
		scopes: ['email account']
	});

	cookies.set('oauth_state', state, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	redirect(302, url.toString());
};
