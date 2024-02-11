import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { options, scope } from '../googleUtil';

import queryString from 'query-string';

export const GET: RequestHandler = async () => {
	const { clientId, redirectUri } = options();
	redirect(
		302,
		`https://accounts.google.com/o/oauth2/v2/auth?${queryString.stringify({
			client_id: clientId,
			redirect_uri: redirectUri,
			response_type: 'code',
			scope,
			include_granted_scopes: 'true',
			state: 'pass-through value',
			access_type: 'offline',
			prompt: 'consent'
		})}`
	);
};
