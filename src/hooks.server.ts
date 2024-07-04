import { i18n } from '$lib/i18n';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authHandle } from './auth';

export const handle = sequence(i18n.handle(), authHandle);
