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
		approach:
			'Separate backend duties (library, streaming) from the web client, with architecture documented alongside the code.',
		stack: ['JavaScript', 'Node ecosystem', 'Web client'],
		reflection: 'End-to-end layout from media library through streaming to the client.',
	},
	{
		slug: 'docker-reader',
		title: 'docker-reader',
		tagline: 'Reader for books across devices; shipped with Docker.',
		repoUrl: 'https://github.com/Arzuparreta/docker-reader',
		languages: ['JavaScript'],
		problem: 'Keep reading progress across devices with a deployable, portable setup.',
		approach: 'Package the app in Docker so deployment and data paths are explicit and reproducible.',
		stack: ['Docker', 'Web stack'],
		reflection: 'Dockerfile and Compose define how the app runs in practice.',
	},
	{
		slug: 'synesthetic-visualizer',
		title: 'synesthetic-visualizer',
		tagline: 'Real-time Rust audio visualizer in a 3D Tonnetz space.',
		repoUrl: 'https://github.com/Arzuparreta/synesthetic-visualizer',
		languages: ['Rust'],
		problem: 'Visualize audio with harmonic structure and low latency.',
		approach: 'Rust on the real-time path; rendering and audio pipeline are implemented in the project sources.',
		stack: ['Rust', 'Audio', 'Graphics'],
		reflection: 'Finer points live in the implementation and in recent commits.',
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
		reflection: 'Commit history shows how experiments and tools evolved.',
	},
	{
		slug: 'remove-multi-titles-yt',
		title: 'remove-multi-titles-yt',
		tagline: 'Browser extension to normalize YouTube titles (Chrome/Firefox).',
		repoUrl: 'https://github.com/Arzuparreta/remove-multi-titles-yt',
		languages: ['JavaScript'],
		problem: 'Reduce duplicate or inconsistent titles for the same video in the browser.',
		approach: 'Small, focused extension with behaviour and scope defined in source and manifest.',
		stack: ['WebExtensions', 'JavaScript'],
		reflection: 'Manifest and store listings cover packaging and distribution.',
	},
];
