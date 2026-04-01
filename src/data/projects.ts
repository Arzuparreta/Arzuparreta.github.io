/**
 * Technical projects — plain narrative, no template labels in the UI.
 * https://github.com/Arzuparreta
 */
export type ProjectTier = 'primary' | 'secondary';

export type PrimaryProject = {
	slug: string;
	title: string;
	/** Comma-separated core technologies (shown after title). */
	tech: string;
	/** What it is and what problem it solves. */
	why: string;
	/** One or two concrete technical or operational details. */
	how: [string] | [string, string];
	repoUrl: string;
	tier: 'primary';
};

export type SecondaryProject = {
	slug: string;
	title: string;
	tech: string;
	/** Single sentence for compact listing. */
	summary: string;
	repoUrl: string;
	tier: 'secondary';
};

export type Project = PrimaryProject | SecondaryProject;

export const projects: Project[] = [
	{
		slug: 'homelab',
		title: 'Remote administration & homelab',
		tech: 'Debian, Tailscale, Pi-hole, SSH, Mosh',
		why:
			'A headless home server in Seville is my day-to-day ops base: I need reliable remote access, sane DNS, and ad blocking across the network without opening SSH to the whole internet.',
		how: [
			'I administer it from a ThinkPad over Tailscale with Mosh for resilient sessions; Pi-hole sits on the mesh for network-wide filtering.',
			'No public SSH: Tailscale is the only path in, which keeps the attack surface small.',
		],
		tier: 'primary',
		repoUrl: 'https://github.com/Arzuparreta',
	},
	{
		slug: 'soundsible',
		title: 'soundsible',
		tech: 'JavaScript, Node, SQLite, Docker, Python',
		why:
			'Self-hosted music library and streaming so my collection lives on hardware I control, with a web client and indexing that stay in sync.',
		how: [
			'SQLite holds the catalog on a headless Linux host; services split between indexing, streaming, and the web UI, all documented in the repo.',
			'It runs as daily-use infrastructure with stable uptime on that box.',
		],
		tier: 'primary',
		repoUrl: 'https://github.com/Arzuparreta/soundsible',
	},
	{
		slug: 'synesthetic-visualizer',
		title: 'synesthetic-visualizer',
		tech: 'Rust, real-time audio, GPU-oriented graphics',
		why:
			'A desktop app that maps live audio into a 3D Tonnetz so harmonic relationships are visible in real time—useful for ear training and experimentation.',
		how: [
			'Rust owns the low-latency capture and render path so the picture stays locked to the signal.',
		],
		tier: 'primary',
		repoUrl: 'https://github.com/Arzuparreta/synesthetic-visualizer',
	},
	{
		slug: 'docker-reader',
		title: 'docker-reader',
		tech: 'Docker, Docker Compose, JavaScript',
		why:
			'A personal ebook reader I can run anywhere Docker runs, with the same layout of volumes and config on every machine.',
		how: [
			'Dockerfile and Compose pin how the app starts, mounts data, and picks up settings—no one-off server setup.',
		],
		tier: 'primary',
		repoUrl: 'https://github.com/Arzuparreta/docker-reader',
	},
	{
		slug: 'brain',
		title: 'brain',
		tech: 'Python',
		summary:
			'Public monorepo of small Python CLIs and experiments—commit history is the story of turning throwaways into reusable tools.',
		repoUrl: 'https://github.com/Arzuparreta/brain',
		tier: 'secondary',
	},
	{
		slug: 'remove-multi-titles-yt',
		title: 'remove-multi-titles-yt',
		tech: 'JavaScript, WebExtensions',
		summary:
			'Chrome/Firefox extension that strips duplicate junk from YouTube titles—one narrow DOM fix, no extra services.',
		repoUrl: 'https://github.com/Arzuparreta/remove-multi-titles-yt',
		tier: 'secondary',
	},
];

export const primaryProjects = projects.filter((p): p is PrimaryProject => p.tier === 'primary');
export const secondaryProjects = projects.filter((p): p is SecondaryProject => p.tier === 'secondary');
