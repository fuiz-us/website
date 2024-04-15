import type { D1Database, KVNamespace, R2Bucket } from '@cloudflare/workers-types';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			google: boolean;
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
		// interface PageData {}
		interface Platform {
			env: {
				BUCKET: R2Bucket;
				DATABASE: D1Database;
				MAP: KVNamespace;
				FUIZ_POLL: KVNamespace;
			};
		}
	}
}

export {};
