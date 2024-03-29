import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			google: boolean;
		}
		// interface PageData {}
		interface Platform {
			env: {
				BUCKET: R2Bucket;
				DATABASE: D1Database;
			};
		}
	}
}

export {};
