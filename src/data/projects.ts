/**
 * Featured work — structured for case-study presentation.
 * Repos: https://github.com/Arzuparreta
 */
export type Project = {
	slug: string;
	title: string;
	tagline: string;
	repoUrl: string;
	languages: string[];
	problem: string;
	approach: string;
	stack: string[];
	reflection: string;
};

export const projects: Project[] = [
	{
		slug: 'soundsible',
		title: 'soundsible',
		tagline: 'Self-hosted streaming shaped like a familiar product, without the vendor.',
		repoUrl: 'https://github.com/Arzuparreta/soundsible',
		languages: ['JavaScript'],
		problem:
			'Commercial streaming optimizes for lock-in and opaque pipelines. I wanted playback and library logic under my control, with a web client that stays thin while the “home” machine does the real work.',
		approach:
			'Separate concerns: a backend that owns indexing, transcoding decisions, and streaming; a frontend focused on navigation and playback state. The architecture mirrors how paid services feel—without surrendering data or deployment to a third party.',
		stack: ['Node.js ecosystem', 'Web client', 'Self-hosted deployment'],
		reflection:
			'This project is as much about boundaries as about audio—where the server ends, how much state lives in the browser, and how to keep operations understandable when you are also the admin.',
	},
	{
		slug: 'docker-reader',
		title: 'docker-reader',
		tagline: 'Reading progress that survives devices—packaged for reproducible runs.',
		repoUrl: 'https://github.com/Arzuparreta/docker-reader',
		languages: ['JavaScript'],
		problem:
			'Bookmarks scatter across apps and formats. I needed one place for “where I am in this book,” accessible wherever I read, without depending on a proprietary sync layer.',
		approach:
			'Ship the app in Docker so environment and data paths are explicit. Favor a small, inspectable surface area: sync becomes a problem you can reason about with files and backups, not hidden cloud state.',
		stack: ['Docker', 'Web stack', 'Persistent volumes'],
		reflection:
			'Packaging forces honesty about persistence and upgrades—good practice for anything meant to run for years on a home server.',
	},
	{
		slug: 'synesthetic-visualizer',
		title: 'synesthetic-visualizer',
		tagline: 'Real-time audio → geometry, with harmonic structure made visible.',
		repoUrl: 'https://github.com/Arzuparreta/synesthetic-visualizer',
		languages: ['Rust'],
		problem:
			'Generic visualizers decorate amplitude. I wanted something tied to musical structure: synesthetic mapping and harmonic relationships, rendered in a Tonnetz-style space with minimal latency.',
		approach:
			'Rust for the hot path: predictable performance where audio and graphics meet. The 3D Tonnetz is not decoration—it encodes relationships I care about when listening.',
		stack: ['Rust', 'Real-time audio', '3D graphics'],
		reflection:
			'This sits at the intersection of perception, DSP, and rendering—where small algorithmic choices are audible and visible.',
	},
	{
		slug: 'brain',
		title: 'brain',
		tagline: 'Experiments and tooling in Python—ideas worth capturing before they evaporate.',
		repoUrl: 'https://github.com/Arzuparreta/brain',
		languages: ['Python'],
		problem:
			'Not everything deserves a polished product immediately; some work is exploratory notebooks, scripts, and half-formed systems that still need a home.',
		approach:
			'A loose Python workspace for prototypes—kept public as a signal of how I iterate, not as a marketing demo.',
		stack: ['Python'],
		reflection:
			'Visibility of rough work is a deliberate choice: judgment comes from trajectory, not only from finished artifacts.',
	},
	{
		slug: 'remove-multi-titles-yt',
		title: 'remove-multi-titles-yt',
		tagline: 'Browser extension: one canonical title per YouTube video.',
		repoUrl: 'https://github.com/Arzuparreta/remove-multi-titles-yt',
		languages: ['JavaScript'],
		problem:
			'The same video can appear under different titles across sessions and surfaces—noise for anyone curating or searching their history.',
		approach:
			'A small, focused extension that stabilizes title presentation in the browser—minimal scope, clear user-facing win.',
		stack: ['WebExtensions', 'DOM', 'Chrome & Firefox'],
		reflection:
			'Shipping to extension stores is a reminder that distribution and policy matter as much as code.',
	},
];
