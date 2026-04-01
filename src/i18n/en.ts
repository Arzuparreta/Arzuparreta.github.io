import type { Messages } from './types';

/** English copy — default site language. */
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
		selectedWork: 'Selected work',
		repositories: 'Repositories',
		education: 'Education',
		cvFile: 'CV file',
		contact: 'Contact',
		github: 'GitHub',
	},
	identity: {
		headline: 'Junior Linux Systems Administrator | DevOps Enthusiast',
		location: 'Seville, Spain',
		openToRelocation: ' · Open to relocation',
	},
	sections: {
		skills: {
			title: 'Technical skills',
			intro: 'As listed on the CV.',
		},
		selectedWork: {
			title: 'Selected work',
			intro: 'Infrastructure and automation projects from the CV.',
		},
		projects: {
			title: 'Public repositories',
			intro: 'Open source on GitHub (problem / approach / stack / note per repo).',
		},
		education: {
			title: 'Education',
		},
		cv: {
			title: 'CV file',
			downloadCv: 'Download CV.md',
			viewCv: 'View CV.md',
			cvRepo: 'CV repository',
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
	],
	education: {
		title: "Bachelor's degree in Music (Classical Performance | Trombone)",
		institution: 'Manuel Castillo Superior Conservatory of Music',
		note: 'Demonstrated constant discipline, analytical thinking and high level of control under pressure.',
	},
	projectCase: {
		repository: 'Repository',
		problem: 'Problem',
		approach: 'Approach',
		stack: 'Stack',
		reflection: 'Reflection',
	},
};
