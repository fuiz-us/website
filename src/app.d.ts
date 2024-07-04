import type { Ai, D1Database, KVNamespace, R2Bucket } from '@cloudflare/workers-types';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			paraglide: ParaglideLocals<AvailableLanguageTag>;
		}
		// interface PageData {}
		interface Platform {
			env: {
				BUCKET: R2Bucket;
				DATABASE: D1Database;
				MAP: KVNamespace;
				FUIZ_POLL: KVNamespace;
				AI: Ai;
			};
		}
	}
}

export {};
