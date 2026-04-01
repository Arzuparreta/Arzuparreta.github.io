/**
 * Scroll-spy for in-page nav: syncs aria-current on the link for the section
 * nearest the top of the viewport. Works with smooth CSS scroll; respects
 * reduced motion via scroll listener only (no animation here).
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

function getSections(): HTMLElement[] {
	const main = document.querySelector('.site-main');
	if (!main) return [];
	return Array.from(main.querySelectorAll<HTMLElement>('section[id]'));
}

function activeSectionId(sections: HTMLElement[], markerPx: number): string | undefined {
	let current: string | undefined;
	for (const section of sections) {
		const top = section.getBoundingClientRect().top;
		if (top <= markerPx) {
			current = section.id;
		}
	}
	return current;
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

function syncFromHash(links: HTMLAnchorElement[]): void {
	const raw = window.location.hash.slice(1);
	if (!raw) return;
	const el = document.getElementById(raw);
	if (!el) return;
	const section = el.closest('section[id]');
	if (!section?.id) return;
	setCurrentNav(links, section.id);
}

export function initInPageNav(): void {
	const sections = getSections();
	const links = getAnchorLinks();
	if (sections.length === 0 || links.length === 0) return;

	/** Section top crosses this distance below the viewport top → that section is "current". */
	const markerPx = Math.min(120, Math.max(48, window.innerHeight * 0.12));

	let ticking = false;
	const onScrollOrResize = (): void => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			ticking = false;
			const id = activeSectionId(sections, markerPx);
			setCurrentNav(links, id);
		});
	};

	window.addEventListener('scroll', onScrollOrResize, { passive: true });
	window.addEventListener('resize', onScrollOrResize, { passive: true });
	window.addEventListener('hashchange', () => syncFromHash(links));

	for (const link of links) {
		link.addEventListener('click', () => {
			const href = link.getAttribute('href');
			if (!href || href.length < 2) return;
			const id = href.slice(1);
			const target = document.getElementById(id);
			const section = target?.closest('section[id]');
			if (section?.id) {
				window.requestAnimationFrame(() => setCurrentNav(links, section.id));
			}
		});
	}

	onScrollOrResize();
	syncFromHash(links);
}
