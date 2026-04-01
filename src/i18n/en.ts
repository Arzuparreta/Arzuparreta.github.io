import type { Messages } from './types';

export const en: Messages = {
	meta: {
		title: 'Rubén Peña Rubio — Junior Linux Systems Administrator · DevOps',
		description:
			'Junior Linux Systems Administrator and DevOps enthusiast in Seville, Spain. Self-taught Linux and infrastructure focus: Docker, networking, Python automation, Bash, Git.',
	},
	a11y: {
		skipToContent: 'Skip to content',
	},
	nav: {
		ariaLabel: 'Primary',
		intro: 'Intro',
		skills: 'Skills',
		selectedWork: 'Featured work',
		repositories: 'Repositories',
		education: 'Education',
		cvFile: 'CV',
		contact: 'Contact',
		github: 'GitHub',
	},
	identity: {
		headline: 'Junior Linux Systems Administrator\u00a0|\u00a0DevOps Enthusiast',
		location: 'Seville,\u00a0Spain',
		openToRelocation: 'Open to relocation',
	},
	sections: {
		skills: {
			title: 'Technical skills',
			intro: 'Operating systems, infrastructure, networking, and tooling I use regularly.',
		},
		selectedWork: {
			title: 'Featured work',
			intro: 'Hands-on infrastructure and automation from my home lab and day-to-day practice.',
		},
		projects: {
			title: 'Public repositories',
			intro: 'Open-source work on GitHub with a short write-up for each project below.',
		},
		education: {
			title: 'Education',
		},
		cv: {
			title: 'CV',
			downloadCv: 'Download CV',
			viewCv: 'View online',
			cvRepo: 'Source on GitHub',
		},
		contact: {
			title: 'Contact',
		},
	},
	profileLead:
		'Self-taught Linux systems and infrastructure enthusiast with 10+ years of hardware/OS tinkering and 2 years focused on containerization (Docker), networking, and Python. Background in musical analysis and interpretation. Seeking a Junior Systems Administrator or DevOps role.',
	technicalSkills: [
		'Operating systems: UNIX/Linux (Arch, Debian, Ubuntu)',
		'Infrastructure: Docker, Docker Compose, Portainer',
		'Networking: SSH/Mosh, Tailscale, Samba, VPN',
		'Automation: Python (CLI and API development), Bash, Git',
	],
	cvWorkSamples: [
		{
			title: 'Self-Hosted Media & Library Infrastructure',
			stack: 'Python, Docker, SQLite',
			bullets: [
				'Managed persistent data storage with SQLite and automated media indexing.',
				'System in daily use with ~99% uptime on a personal headless server.',
			],
		},
		{
			title: 'Remote Server Administration & Zero-Trust Networking',
			stack: 'Linux, Tailscale',
			bullets: [
				'Architected a secure remote-access workflow using Tailscale and Mosh to maintain and manage a headless server located in Seville from a ThinkPad anywhere in Spain.',
				'Configured network-wide ad blocking with Pi-hole over Tailscale.',
				'Tuned hardware overclocks and power curves for stable sustained load.',
			],
		},
	],
	education: {
		title: "Bachelor's degree in Music (Classical Performance | Trombone)",
		institution: 'Manuel Castillo Superior Conservatory of Music',
		note: 'Demonstrated constant discipline, analytical thinking and high level of control under pressure.',
	},
	projectCase: {
		repository: 'Repository',
		problem: 'Challenge',
		approach: 'Approach',
		stack: 'Technologies',
		reflection: 'Takeaways',
	},
};
