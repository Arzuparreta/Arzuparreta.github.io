import type { LocaleBundle } from './locale-client';
import { getLocaleFromPath } from './locale-client';

const COPIED_MS = 1800;

export function initCopyEmail(bundle: LocaleBundle): void {
	const btn = document.getElementById('copy-email-btn');
	if (!btn || !(btn instanceof HTMLButtonElement)) return;
	const email = btn.dataset.email;
	if (!email) return;

	let resetTimer: ReturnType<typeof setTimeout> | undefined;

	const restoreLabel = (): void => {
		const locale = getLocaleFromPath(window.location.pathname, bundle.baseUrl);
		btn.textContent = bundle.messages[locale].sections.contact.copyEmail;
	};

	btn.addEventListener('click', () => {
		if (resetTimer !== undefined) {
			clearTimeout(resetTimer);
			resetTimer = undefined;
		}
		void navigator.clipboard.writeText(email).then(
			() => {
				const locale = getLocaleFromPath(window.location.pathname, bundle.baseUrl);
				btn.textContent = bundle.messages[locale].sections.contact.copied;
				resetTimer = setTimeout(() => {
					restoreLabel();
					resetTimer = undefined;
				}, COPIED_MS);
			},
			() => {
				console.warn('copy-email: clipboard write failed');
			},
		);
	});
}
