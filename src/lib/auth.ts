import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import type { D1Database } from '@cloudflare/workers-types';
import { D1Adapter } from '@lucia-auth/adapter-sqlite';

export function initializeLucia(D1: D1Database) {
	const adapter = new D1Adapter(D1, {
		user: 'user',
		session: 'session'
	});
	return new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				// set to `true` when using HTTPS
				secure: !dev
			}
		}
	});
}

declare module 'lucia' {
	interface Register {
		Auth: ReturnType<typeof initializeLucia>;
	}
}
