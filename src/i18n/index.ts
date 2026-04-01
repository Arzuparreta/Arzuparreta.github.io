/**
 * UI strings for the site. Default locale is `defaultLocale` in `./config`.
 *
 * Next steps for a Spanish page: add a route (e.g. `src/pages/es/index.astro`) with
 * `const t = getMessages('es')`, pass `lang="es"` to `BaseLayout`, and add `hreflang`
 * / `alternate` links. Project copy stays in English in `data/projects.ts` until you add per-locale variants.
 */
export type { Locale } from './config';
export { defaultLocale, supportedLocales } from './config';
export type { Messages } from './types';
export { en } from './en';
export { es } from './es';

import type { Locale } from './config';
import type { Messages } from './types';
import { en } from './en';
import { es } from './es';

const byLocale: Record<Locale, Messages> = {
	en,
	es,
};

export function getMessages(locale: Locale): Messages {
	return byLocale[locale];
}
