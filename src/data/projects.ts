/**
 * Technical projects — infrastructure-first narrative.
 * https://github.com/Arzuparreta
 */
export type ProjectTier = 'primary' | 'secondary';

export type Project = {
	slug: string;
	title: string;
	tagline: string;
	repoUrl: string;
	languages: string[];
	/** Tools and platforms (Docker, Linux, Tailscale, etc.) */
	stack: string;
	/** How and where it runs (hosting, topology, deployment). */
	architecture: string;
	/** One concrete technical outcome or win. */
	keyFeature: string;
	tier: ProjectTier;
	liveUrl?: string;
};

export const projects: Project[] = [
	{
		slug: 'homelab',
		title: 'Remote administration & homelab',
		tagline:
			'Zero-trust remote access, network-wide DNS filtering, and day-to-day ops on a headless home server.',
		repoUrl: 'https://github.com/Arzuparreta',
		languages: ['Linux', 'Tailscale'],
		stack: 'Debian Linux, Tailscale (mesh VPN), Mosh, SSH, Pi-hole, tuned hardware for stable sustained load.',
		architecture:
			'A headless server in Seville acts as the home backbone; I maintain it from a ThinkPad using Mosh over Tailscale for encrypted, low-latency access from anywhere in Spain. Pi-hole provides network-wide ad blocking across the Tailscale mesh.',
		keyFeature:
			'Secure remote administration without exposing SSH to the public internet—Tailscale as the zero-trust perimeter.',
		tier: 'primary',
	},
	{
		slug: 'soundsible',
		title: 'soundsible',
		tagline: 'Self-hosted music platform: library, streaming, and web client backed by your own machine.',
		repoUrl: 'https://github.com/Arzuparreta/soundsible',
		languages: ['JavaScript'],
		stack: 'JavaScript/Node, SQLite, Docker, Python for media tooling where applicable; runs on a personal Linux server.',
		architecture:
			'Services split between library/indexing, streaming, and web client, with SQLite for persistent catalog data on a headless host—documented alongside the code.',
		keyFeature:
			'Daily-use stack with roughly 99% uptime on self-hosted hardware and automated media indexing.',
		tier: 'primary',
	},
	{
		slug: 'synesthetic-visualizer',
		title: 'synesthetic-visualizer',
		tagline: 'Real-time Rust audio visualizer in a 3D Tonnetz space.',
		repoUrl: 'https://github.com/Arzuparreta/synesthetic-visualizer',
		languages: ['Rust'],
		stack: 'Rust, audio I/O, GPU-oriented graphics, real-time pipeline.',
		architecture:
			'Native desktop build with Rust on the low-latency audio and render path; harmonic structure mapped into 3D Tonnetz visualization driven from live input.',
		keyFeature:
			'Performance-critical audio and graphics handled in Rust to keep visualization aligned with the signal.',
		tier: 'primary',
	},
	{
		slug: 'docker-reader',
		title: 'docker-reader',
		tagline: 'Reader for books across devices; shipped with Docker.',
		repoUrl: 'https://github.com/Arzuparreta/docker-reader',
		languages: ['JavaScript'],
		stack: 'Docker, Docker Compose, JavaScript web stack.',
		architecture:
			'Packaged as a containerized service with explicit volume and config paths so it deploys the same way on any Docker host.',
		keyFeature: 'Reproducible deploys: Dockerfile and Compose define how the app runs in practice.',
		tier: 'primary',
	},
	{
		slug: 'brain',
		title: 'brain',
		tagline: 'Python workspace for experiments and tooling.',
		repoUrl: 'https://github.com/Arzuparreta/brain',
		languages: ['Python'],
		stack: 'Python, small CLIs and scripts.',
		architecture:
			'Public monorepo of incremental experiments—no single production topology; each tool is a small, focused workflow.',
		keyFeature: 'Commit history shows how prototypes evolve into reusable utilities.',
		tier: 'secondary',
	},
	{
		slug: 'remove-multi-titles-yt',
		title: 'remove-multi-titles-yt',
		tagline: 'Browser extension to normalize YouTube titles (Chrome/Firefox).',
		repoUrl: 'https://github.com/Arzuparreta/remove-multi-titles-yt',
		languages: ['JavaScript'],
		stack: 'WebExtensions API, JavaScript, Chrome/Firefox manifests.',
		architecture:
			'Runs entirely in the browser; packaging and store listings are defined in the manifest and repository.',
		keyFeature: 'Narrow scope: fix inconsistent duplicate titles without extra moving parts.',
		tier: 'secondary',
	},
];

export const primaryProjects = projects.filter((p) => p.tier === 'primary');
export const secondaryProjects = projects.filter((p) => p.tier === 'secondary');
