import type { Messages } from './types';

/**
 * Spanish copy — use with `getMessages('es')` when you add `/es/` or a locale switch.
 * Repository project blurbs (`data/projects.ts`) stay in English until you add per-locale project data.
 */
export const es: Messages = {
	meta: {
		title: 'Rubén Peña Rubio — Administrador de sistemas Linux junior · DevOps',
		description:
			'Administrador de sistemas Linux junior y entusiasta de DevOps en Sevilla, España. Enfoque autodidacta en Linux e infraestructura: Docker, redes, automatización con Python, Bash, Git.',
	},
	a11y: {
		skipToContent: 'Saltar al contenido',
	},
	nav: {
		ariaLabel: 'Principal',
		intro: 'Intro',
		skills: 'Habilidades',
		selectedWork: 'Trabajos destacados',
		repositories: 'Repositorios',
		education: 'Formación',
		cvFile: 'CV',
		contact: 'Contacto',
		github: 'GitHub',
	},
	identity: {
		headline: 'Administrador de sistemas Linux junior\u00a0|\u00a0Entusiasta de DevOps',
		location: 'Sevilla,\u00a0España',
		openToRelocation: 'Dispuesto a mudarme',
	},
	sections: {
		skills: {
			title: 'Habilidades técnicas',
			intro: 'Como figuran en el CV.',
		},
		selectedWork: {
			title: 'Trabajos destacados',
			intro: 'Proyectos de infraestructura y automatización del CV.',
		},
		projects: {
			title: 'Repositorios públicos',
			intro: 'Código abierto en GitHub (problema / enfoque / stack / nota por repositorio).',
		},
		education: {
			title: 'Formación',
		},
		cv: {
			title: 'Archivo CV',
			downloadCv: 'Descargar CV.md',
			viewCv: 'Ver CV.md',
			cvRepo: 'Repositorio del CV',
		},
		contact: {
			title: 'Contacto',
		},
	},
	profileLead:
		'Entusiasta autodidacta de sistemas Linux e infraestructura con más de 10 años experimentando con hardware y SO y 2 años centrado en contenedores (Docker), redes y Python. Formación en análisis e interpretación musical. Busco un puesto junior de administrador de sistemas o DevOps.',
	technicalSkills: [
		'Sistemas operativos: UNIX/Linux (Arch, Debian, Ubuntu)',
		'Infraestructura: Docker, Docker Compose, Portainer',
		'Redes: SSH/Mosh, Tailscale, Samba, VPN',
		'Automatización: Python (CLI y desarrollo de APIs), Bash, Git',
	],
	cvWorkSamples: [
		{
			title: 'Infraestructura de medios y biblioteca self-hosted',
			stack: 'Python, Docker, SQLite',
			bullets: [
				'Gestioné almacenamiento persistente con SQLite e indexación automatizada de medios.',
				'Resultado: sistema en uso diario con ~99% de disponibilidad en un servidor personal sin monitor.',
			],
		},
		{
			title: 'Administración remota de servidor y red de confianza cero',
			stack: 'Linux, Tailscale',
			bullets: [
				'Diseñé un flujo de acceso remoto seguro con Tailscale y Mosh para administrar un servidor en Sevilla desde un ThinkPad en cualquier punto de España.',
				'Configuré bloqueo de anuncios en toda la red de Tailscale con Pi-hole.',
				'Gestioné overclocks de hardware y optimizaciones de curvas para máxima estabilidad.',
			],
		},
	],
	education: {
		title: 'Grado en Música (Interpretación clásica | Trombón)',
		institution: 'Conservatorio Superior de Música Manuel Castillo',
		note: 'Demostró disciplina constante, pensamiento analítico y alto nivel de control bajo presión.',
	},
	projectCase: {
		repository: 'Repositorio',
		problem: 'Problema',
		approach: 'Enfoque',
		stack: 'Stack',
		reflection: 'Reflexión',
	},
};
