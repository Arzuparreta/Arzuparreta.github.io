/**
 * Technical projects — plain narrative, no template labels in the UI.
 * https://github.com/Arzuparreta
 */
import type { Locale } from '../i18n/config';

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

const projectsEn: Project[] = [
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

const projectsEs: Project[] = [
	{
		slug: 'homelab',
		title: 'Administración remota y homelab',
		tech: 'Debian, Tailscale, Pi-hole, SSH, Mosh',
		why:
			'Un servidor casero sin interfaz gráfica en Sevilla es mi base operativa: necesito acceso remoto fiable, DNS razonable y bloqueo de anuncios en toda la red sin exponer SSH a internet.',
		how: [
			'Lo administro desde un ThinkPad por Tailscale con Mosh para sesiones resilientes; Pi-hole en la malla para filtrado en toda la red.',
			'Sin SSH público: Tailscale es la única entrada, lo que mantiene la superficie de ataque pequeña.',
		],
		tier: 'primary',
		repoUrl: 'https://github.com/Arzuparreta',
	},
	{
		slug: 'soundsible',
		title: 'soundsible',
		tech: 'JavaScript, Node, SQLite, Docker, Python',
		why:
			'Biblioteca musical autoalojada y streaming para que mi colección viva en hardware que controlo, con cliente web e indexación sincronizados.',
		how: [
			'SQLite guarda el catálogo en un host Linux sin cabeza; servicios separados para indexación, streaming e interfaz web, todo documentado en el repositorio.',
			'Funciona como infraestructura de uso diario con buen tiempo activo en esa máquina.',
		],
		tier: 'primary',
		repoUrl: 'https://github.com/Arzuparreta/soundsible',
	},
	{
		slug: 'synesthetic-visualizer',
		title: 'synesthetic-visualizer',
		tech: 'Rust, audio en tiempo real, gráficos orientados a GPU',
		why:
			'Una aplicación de escritorio que mapea audio en vivo a un Tonnetz 3D para que las relaciones armónicas se vean en tiempo real: útil para entrenamiento auditivo y experimentación.',
		how: [
			'Rust controla la captura y el renderizado de baja latencia para que la imagen vaya al unísono con la señal.',
		],
		tier: 'primary',
		repoUrl: 'https://github.com/Arzuparreta/synesthetic-visualizer',
	},
	{
		slug: 'docker-reader',
		title: 'docker-reader',
		tech: 'Docker, Docker Compose, JavaScript',
		why:
			'Un lector de libros electrónicos personal que puedo ejecutar donde haya Docker, con el mismo esquema de volúmenes y configuración en cada máquina.',
		how: [
			'Dockerfile y Compose fijan cómo arranca la aplicación, monta datos y lee ajustes, sin instalaciones ad hoc en servidores.',
		],
		tier: 'primary',
		repoUrl: 'https://github.com/Arzuparreta/docker-reader',
	},
	{
		slug: 'brain',
		title: 'brain',
		tech: 'Python',
		summary:
			'Monorepo público de CLIs y experimentos en Python: el historial de commits cuenta cómo convertir pruebas en herramientas reutilizables.',
		repoUrl: 'https://github.com/Arzuparreta/brain',
		tier: 'secondary',
	},
	{
		slug: 'remove-multi-titles-yt',
		title: 'remove-multi-titles-yt',
		tech: 'JavaScript, WebExtensions',
		summary:
			'Extensión para Chrome/Firefox que elimina basura duplicada en títulos de YouTube: un arreglo DOM acotado, sin servicios adicionales.',
		repoUrl: 'https://github.com/Arzuparreta/remove-multi-titles-yt',
		tier: 'secondary',
	},
];

const byLocale: Record<Locale, Project[]> = {
	en: projectsEn,
	es: projectsEs,
};

export function getProjects(locale: Locale): Project[] {
	return byLocale[locale];
}

export function getPrimaryProjects(locale: Locale): PrimaryProject[] {
	return getProjects(locale).filter((p): p is PrimaryProject => p.tier === 'primary');
}

export function getSecondaryProjects(locale: Locale): SecondaryProject[] {
	return getProjects(locale).filter((p): p is SecondaryProject => p.tier === 'secondary');
}
