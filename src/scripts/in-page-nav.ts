/**
 * In-page nav: sets aria-current from the URL hash and sidebar clicks only (no
 * scroll-spy—zero scroll/resize work, predictable behavior for a small visual cue).
 */
const SECTION_TO_HASH: Record<string, string> = {
	intro: '#intro-heading',
	skills: '#skills-heading',
	projects: '#projects-heading',
	cv: '#cv-heading',
	contact: '#contact-heading',
};

function getAnchorLinks(): HTMLAnchorElement[] {
	return Array.from(
		document.querySelectorAll<HTMLAnchorElement>('.site-sidebar .nav a[href^="#"]'),
	);
}

function setCurrentNav(links: HTMLAnchorElement[], sectionId: string | undefined): void {
	const hash = sectionId ? SECTION_TO_HASH[sectionId] : undefined;
	for (const link of links) {
		const href = link.getAttribute('href');
		if (href && hash && href === hash) {
			link.setAttribute('aria-current', 'location');
		} else {
			link.removeAttribute('aria-current');
		}
	}
}

function clearCurrentNav(links: HTMLAnchorElement[]): void {
	for (const link of links) {
		link.removeAttribute('aria-current');
	}
}

function syncFromHash(links: HTMLAnchorElement[]): void {
	const raw = window.location.hash.slice(1);
	if (!raw) {
		clearCurrentNav(links);
		return;
	}
	const el = document.getElementById(raw);
	if (!el) return;
	const section = el.closest('section[id]');
	if (!section?.id) return;
	setCurrentNav(links, section.id);
}

let inPageNavInitialized = false;

export function initInPageNav(): void {
	if (inPageNavInitialized) return;
	const links = getAnchorLinks();
	if (links.length === 0) return;
	inPageNavInitialized = true;

	window.addEventListener('hashchange', () => syncFromHash(links));

	for (const link of links) {
		link.addEventListener('click', (e) => {
			const href = link.getAttribute('href');
			if (!href || href.length < 2) return;
			const id = href.slice(1);
			const target = document.getElementById(id);
			const section = target?.closest('section[id]');
			if (!section?.id || !target) return;
			e.preventDefault();
			const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			target.scrollIntoView({
				behavior: prefersReduced ? 'auto' : 'smooth',
				block: 'nearest',
				inline: 'nearest',
			});
			const path = `${window.location.pathname}${window.location.search}${href}`;
			history.replaceState(null, '', path);
			window.requestAnimationFrame(() => setCurrentNav(links, section.id));
		});
	}

	syncFromHash(links);
}
