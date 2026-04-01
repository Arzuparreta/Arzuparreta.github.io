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
			'Servidor Linux en remoto que actúa como infraestructura principal para mis despliegues y servicios de uso diario.',
		how: [
			'Administrado íntegramente desde un ThinkPad mediante Mosh a través de una red Tailscale (Zero-Trust), sin exponer puertos SSH a internet.',
			'Configuración de filtrado DNS a nivel de red (Pi-hole) y optimización de hardware para cargas de trabajo sostenidas.',
		],
		tier: 'primary',
		repoUrl: 'https://github.com/Arzuparreta',
	},
	{
		slug: 'soundsible',
		title: 'Soundsible',
		tech: 'JavaScript, Node, SQLite, Docker, Python',
		why: 'Plataforma musical autoalojada para streaming y gestión de biblioteca propia.',
		how: [
			'Despliegue mediante contenedores en servidor Linux, utilizando SQLite para el almacenamiento persistente del catálogo.',
			'Arquitectura dividida en microservicios (indexación, streaming, cliente web) orientada a mantener una alta disponibilidad (99% uptime).',
		],
		tier: 'primary',
		repoUrl: 'https://github.com/Arzuparreta/soundsible',
	},
	{
		slug: 'synesthetic-visualizer',
		title: 'Synesthetic-visualizer',
		tech: 'Rust, Audio en tiempo real, Renderizado GPU',
		why:
			'Aplicación de escritorio nativa que mapea audio en vivo a un espacio 3D (Tonnetz) para visualizar relaciones armónicas.',
		how: [
			'Desarrollo en Rust para garantizar baja latencia en el procesamiento de audio y renderizado gráfico simultáneo.',
		],
		tier: 'primary',
		repoUrl: 'https://github.com/Arzuparreta/synesthetic-visualizer',
	},
	{
		slug: 'docker-reader',
		title: 'Docker-reader',
		tech: 'Docker, Docker Compose, JavaScript',
		why: 'Lector de libros electrónicos empaquetado y distribuido mediante Docker.',
		how: [
			'Entorno de despliegue estandarizado con configuración explícita de volúmenes, garantizando una ejecución idéntica en cualquier máquina anfitriona.',
		],
		tier: 'primary',
		repoUrl: 'https://github.com/Arzuparreta/docker-reader',
	},
	{
		slug: 'brain',
		title: 'Brain',
		tech: 'Python',
		summary:
			'Monorepo público de scripts y utilidades CLI. Refleja la evolución de prototipos a herramientas de automatización reutilizables.',
		repoUrl: 'https://github.com/Arzuparreta/brain',
		tier: 'secondary',
	},
	{
		slug: 'remove-multi-titles-yt',
		title: 'Remove-multi-titles-yt',
		tech: 'JavaScript, WebExtensions',
		summary:
			'Extensión de navegador ligera para normalizar y limpiar la redundancia en los títulos de YouTube manipulando el DOM de forma eficiente.',
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
