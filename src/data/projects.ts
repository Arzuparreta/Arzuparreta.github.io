/**
 * Public GitHub repositories — descriptions kept conservative (repo purpose only).
 * https://github.com/Arzuparreta
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
		tagline: 'Self-hosted music platform: streaming and web client backed by your own machine.',
		repoUrl: 'https://github.com/Arzuparreta/soundsible',
		languages: ['JavaScript'],
		problem: 'Run a personal music stack without depending on a third-party streaming backend.',
		approach: 'Split backend responsibilities (library, streaming) from the web client; repo is the reference for architecture.',
		stack: ['JavaScript', 'Node ecosystem', 'Web client'],
		reflection: 'This repository documents how the stack is organized end to end.',
	},
	{
		slug: 'docker-reader',
		title: 'docker-reader',
		tagline: 'Reader for books across devices; shipped with Docker.',
		repoUrl: 'https://github.com/Arzuparreta/docker-reader',
		languages: ['JavaScript'],
		problem: 'Keep reading progress across devices with a deployable, portable setup.',
		approach: 'Package the app in Docker so deployment and data paths are explicit in the repo.',
		stack: ['Docker', 'Web stack'],
		reflection: 'Dockerfile and compose files are the source of truth for how the app runs.',
	},
	{
		slug: 'synesthetic-visualizer',
		title: 'synesthetic-visualizer',
		tagline: 'Real-time Rust audio visualizer in a 3D Tonnetz space.',
		repoUrl: 'https://github.com/Arzuparreta/synesthetic-visualizer',
		languages: ['Rust'],
		problem: 'Visualize audio with harmonic structure and low latency.',
		approach: 'Rust for the real-time path; see the repo for rendering and audio pipeline details.',
		stack: ['Rust', 'Audio', 'Graphics'],
		reflection: 'Implementation details live in the repo and commits.',
	},
	{
		slug: 'brain',
		title: 'brain',
		tagline: 'Python workspace for experiments and tooling.',
		repoUrl: 'https://github.com/Arzuparreta/brain',
		languages: ['Python'],
		problem: 'Central place for small Python tools and prototypes.',
		approach: 'Keep work public and incremental rather than a polished product-only release.',
		stack: ['Python'],
		reflection: 'Use the repo history for how ideas evolve.',
	},
	{
		slug: 'remove-multi-titles-yt',
		title: 'remove-multi-titles-yt',
		tagline: 'Browser extension to normalize YouTube titles (Chrome/Firefox).',
		repoUrl: 'https://github.com/Arzuparreta/remove-multi-titles-yt',
		languages: ['JavaScript'],
		problem: 'Reduce duplicate or inconsistent titles for the same video in the browser.',
		approach: 'Small, focused extension; scope is defined in the repository.',
		stack: ['WebExtensions', 'JavaScript'],
		reflection: 'Manifest and store listings in the repo describe distribution.',
	},
];
