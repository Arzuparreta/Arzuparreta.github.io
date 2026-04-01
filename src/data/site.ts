export const site = {
	name: 'Rubén Peña Rubio',
	handle: 'Arzuparreta',
	headline: 'Junior Linux Systems Administrator | DevOps Enthusiast',
	title: 'Rubén Peña Rubio — Junior Linux Systems Administrator · DevOps',
	description:
		'Junior Linux Systems Administrator and DevOps enthusiast in Seville, Spain. Self-taught Linux and infrastructure focus: Docker, networking, Python automation, Bash, Git.',
	url: 'https://arzuparreta.github.io',
	github: 'https://github.com/Arzuparreta',
	cvRepo: 'https://github.com/Arzuparreta/CV',
	linkedin: 'https://www.linkedin.com/in/rub%C3%A9n-pe%C3%B1a-rubio-432953378/',
	email: 'rubenpenarubio02@gmail.com',
	location: 'Seville, Spain',
	openToRelocation: true,
} as const;

/** Copy aligned with github.com/Arzuparreta/CV/blob/main/CV.md — do not invent beyond that file. */
export const profileLead =
	'Self-taught Linux systems and infrastructure enthusiast with 10+ years of hardware/OS tinkering and 2 years focused on containerization (Docker), networking, and Python. Background in musical analysis and interpretation. Seeking a Junior Systems Administrator or DevOps role.';

export const technicalSkills: string[] = [
	'Operating systems: UNIX/Linux (Arch, Debian, Ubuntu)',
	'Infrastructure: Docker, Docker Compose, Portainer',
	'Networking: SSH/Mosh, Tailscale, Samba, VPN',
	'Automation: Python (CLI and API development), Bash, Git',
];

export type CvWorkItem = {
	title: string;
	stack: string;
	bullets: string[];
};

export const cvWorkSamples: CvWorkItem[] = [
	{
		title: 'Self-Hosted Media & Library Infrastructure',
		stack: 'Python, Docker, SQLite',
		bullets: [
			'Managed persistent data storage with SQLite and automated media indexing.',
			'Outcome: daily driven system maintaining 99% uptime on a personal headless server.',
		],
	},
	{
		title: 'Remote Server Administration & Zero-Trust Networking',
		stack: 'Linux, Tailscale',
		bullets: [
			'Architected a secure remote-access workflow using Tailscale and Mosh to maintain and manage a headless server located in Seville from a ThinkPad anywhere in Spain.',
			'Configured tailscale-network-wide ad-blocking using Pi-hole.',
			'Handled hardware overclocks and curve oprmizations for peak stability.',
		],
	},
];

export const education = {
	title: 'Grado en Música (Interpretación Clásica | Trombón)',
	institution: 'Conservatorio Superior de Música Manuel Castillo',
	note: 'Demonstrated constant discipline, analytical thinking and high level of control under pressure.',
} as const;
