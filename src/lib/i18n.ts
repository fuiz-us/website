// src/lib/i18n.js
import { createI18n } from '@inlang/paraglide-sveltekit';
import * as runtime from '$lib/paraglide/runtime.js';

export const i18n = createI18n(runtime, {
	defaultLanguageTag: 'en',
	textDirection: {
		ar: 'rtl',
		az: 'ltr',
		de: 'ltr',
		en: 'ltr',
		es: 'ltr',
		eu: 'ltr',
		fr: 'ltr',
		id: 'ltr',
		it: 'ltr',
		nl: 'ltr',
		pl: 'ltr',
		'zh-cn': 'ltr'
	}
});
