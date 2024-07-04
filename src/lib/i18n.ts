// src/lib/i18n.js
import { createI18n } from '@inlang/paraglide-sveltekit';
import * as runtime from '$lib/paraglide/runtime.js';

export const i18n = createI18n(runtime, {
	defaultLanguageTag: 'en',
	textDirection: {
		ar: 'rtl',
		en: 'ltr',
		de: 'ltr',
		es: 'ltr',
		fr: 'ltr',
		az: 'ltr',
		it: 'ltr',
		nl: 'ltr',
		'zh-cn': 'ltr'
	}
});
