/**
 * Scroll-spy for in-page nav: syncs aria-current using (1) which section contains
 * a reading line below the viewport top, (2) if that fails (gaps, edges), which
 * section has the most visible height—ties prefer the lower section—so short tail
 * sections (CV, Contact) are not skipped. Sidebar clicks use minimal scroll so
 * targets that cannot reach the top still get distinct behavior and highlight.
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

function visibleHeightInViewport(r: DOMRect): number {
	const top = Math.max(0, r.top);
	const bottom = Math.min(window.innerHeight, r.bottom);
	return Math.max(0, bottom - top);
}

function activeSectionId(sections: HTMLElement[], markerPx: number): string | undefined {
	if (sections.length === 0) return undefined;

	// 1) Reading line lies inside a section's vertical bounds
	for (const section of sections) {
		const r = section.getBoundingClientRect();
		if (r.top <= markerPx && r.bottom > markerPx) {
			return section.id;
		}
	}

	// 2) Largest visible slice of viewport; ties → prefer lower section (later in DOM)
	let bestId: string | undefined;
	let bestScore = -1;
	for (let i = 0; i < sections.length; i++) {
		const vis = visibleHeightInViewport(sections[i].getBoundingClientRect());
		if (vis === 0) continue;
		if (vis > bestScore) {
			bestScore = vis;
			bestId = sections[i].id;
		} else if (vis === bestScore) {
			bestId = sections[i].id;
		}
	}
	if (bestId !== undefined) return bestId;

	// 3) No positive intersection: fall back to “last section whose top passed the line”
	let current: string | undefined;
	for (const section of sections) {
		if (section.getBoundingClientRect().top <= markerPx) {
			current = section.id;
		}
	}
	return current ?? sections[0].id;
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

let inPageNavInitialized = false;

export function initInPageNav(): void {
	if (inPageNavInitialized) return;
	const sections = getSections();
	const links = getAnchorLinks();
	if (sections.length === 0 || links.length === 0) return;
	inPageNavInitialized = true;

	/** Horizontal reading line from top of viewport (px). */
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

	onScrollOrResize();
	syncFromHash(links);
}
