/**
 * Entry for bundled client script (must live in a top-level layout file so Astro/Vite bundles it).
 */
import { initLocaleClient } from './locale-client';

export function initHomePageLocale(): void {
	const el = document.getElementById('locale-bundle');
	if (el?.textContent) {
		initLocaleClient(JSON.parse(el.textContent));
	}
}
