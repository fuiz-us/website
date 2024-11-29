import { env } from '$env/dynamic/private';
import { D1Adapter } from '@auth/d1-adapter';
import { SvelteKitAuth } from '@auth/sveltekit';
import type { Provider } from '@auth/sveltekit/providers';
import google from '@auth/sveltekit/providers/google';

const providers: Provider[] =
	(env.AUTH_GOOGLE_ID?.length ?? 0) > 0 && (env.AUTH_GOOGLE_SECRET?.length ?? 0) > 0
		? [
				google({
					clientId: env.AUTH_GOOGLE_ID,
					clientSecret: env.AUTH_GOOGLE_SECRET,
					authorization: {
						params: {
							prompt: 'consent',
							access_type: 'offline',
							response_type: 'code'
						}
					}
				})
			]
		: [];

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
	secret: env.AUTH_SECRET,
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
