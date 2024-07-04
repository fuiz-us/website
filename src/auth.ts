import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET } from '$env/static/private';
import { D1Adapter } from '@auth/d1-adapter';
import { SvelteKitAuth } from '@auth/sveltekit';
import type { Provider } from '@auth/sveltekit/providers';
import google from '@auth/sveltekit/providers/google';

const providers: Provider[] = [
	google({
		clientId: AUTH_GOOGLE_ID,
		clientSecret: AUTH_GOOGLE_SECRET,
		authorization: {
			params: {
				prompt: 'consent',
				access_type: 'offline',
				response_type: 'code'
			}
		}
	})
];

export const providerMap = providers.map((provider) => {
	if (typeof provider === 'function') {
		const providerData = provider();
		return { id: providerData.id, name: providerData.name };
	} else {
		return { id: provider.id, name: provider.name };
	}
});

export const { handle } = SvelteKitAuth(async (event) => ({
	providers,
	trustHost: true,
	secret: AUTH_SECRET,
	adapter: D1Adapter(event.platform?.env.DATABASE),
	callbacks: {
		session({ session, user }) {
			session.user.id = user.id;
			return session;
		}
	},
	pages: {
		signIn: '/signin'
	}
}));
