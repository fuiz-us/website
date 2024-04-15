import { env } from '$env/dynamic/private';
import { error, type Cookies } from '@sveltejs/kit';
import { OAuth2Client } from 'oslo/oauth2';

export const options = () =>
	({
		clientId: env.OAUTH_CLIENT_ID,
		clientSecret: env.OAUTH_CLIENT_SECRET,
		redirectUri: env.OAUTH_REDIRECT_URI
	} as const);

export const scope = 'email account' as const;

export function getToken(cookies: Cookies): string {
	const credintials = cookies.get('oauth');
	if (!credintials) error(401, 'no oauth cookie');
	return credintials;
}

export function initClient() {
	const oauth2Client = new OAuth2Client(
		env.OAUTH_CLIENT_ID,
		env.OAUTH_AUTHORIZE_URL,
		env.OAUTH_TOKEN_URL,
		{
			redirectURI: env.OAUTH_REDIRECT_URI
		}
	);
	return oauth2Client;
}

// export async function refreshToken(tokens: OAuthTokens): Promise<OAuthTokens | undefined> {
// 	const { clientId, clientSecret } = options();
// 	const response = await bring('https://oauth2.googleapis.com/token', {
// 		method: 'POST',
// 		headers: {
// 			'content-type': 'application/json',
// 			accept: 'application/json'
// 		},
// 		body: JSON.stringify({
// 			client_id: clientId,
// 			client_secret: clientSecret,
// 			refreshToken: tokens.refresh_token,
// 			grant_type: 'refresh_token'
// 		})
// 	});

// 	if (!response?.ok) return undefined;

// 	return {
// 		...tokens,
// 		...(await response.json())
// 	};
// }
