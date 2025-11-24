import { loadTranslations, supportedLocalesOptions } from '$lib/translations/translations';

export const prerender = true;
export const ssr = false;

loadTranslations(supportedLocalesOptions[0].value);
