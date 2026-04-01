/**
 * Entry for bundled client script (must live in a top-level layout file so Astro/Vite bundles it).
 */
import { initCopyEmail } from './copy-email';
import { initLocaleClient } from './locale-client';
import { initTheme } from './theme';

export function initHomePageLocale(): void {
	const el = document.getElementById('locale-bundle');
	if (el?.textContent) {
		const bundle = JSON.parse(el.textContent);
		initLocaleClient(bundle);
		initTheme(bundle);
		initCopyEmail(bundle);
	}
}
