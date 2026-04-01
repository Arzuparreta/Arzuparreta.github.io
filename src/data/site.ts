export const site = {
	name: 'Rubén Peña Rubio',
	handle: 'Arzuparreta',
	title: 'Rubén Peña Rubio — developer, musician, builder',
	description:
		'Portfolio of Rubén Peña Rubio (Arzuparreta): open-source systems, audio tooling, and self-hosted software—built with clarity and long-term ownership in mind.',
	url: 'https://arzuparreta.github.io',
	github: 'https://github.com/Arzuparreta',
	location: 'Spain',
} as const;

export const philosophy = {
	lede: 'I build software the way I make music: attentive to structure, honest about constraints, and suspicious of effects that hide the underlying line.',
	points: [
		{
			head: 'Ownership over novelty',
			body: 'Prefer stacks I can deploy, inspect, and repair. If a dependency does not earn its place, it goes.',
		},
		{
			head: 'Interfaces that respect time',
			body: 'Users and future-me both deserve predictable behavior, fast feedback, and documentation that matches reality.',
		},
		{
			head: 'Proof in repositories',
			body: 'Claims belong next to commits. Public work is the most direct signal I can offer collaborators and employers.',
		},
	],
} as const;

export const cvHighlights = {
	summary:
		'Developer and musician based in Spain. I ship full-stack and systems-adjacent work—JavaScript and Rust for products, Python for exploration—with an emphasis on self-hosted deployments and honest architecture.',
	skills: [
		'Rust — performance-sensitive tooling, audio/visual pipelines',
		'JavaScript / Node — web apps, extensions, streaming backends',
		'Python — prototyping, automation, experimentation',
		'Docker — reproducible environments and home-server workflows',
		'Music & perception — synesthesia-informed visualization, harmonic structure',
	],
} as const;
