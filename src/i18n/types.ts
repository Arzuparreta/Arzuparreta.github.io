export type Messages = {
	meta: {
		title: string;
		description: string;
	};
	a11y: {
		skipToContent: string;
		siteAside: string;
	};
	nav: {
		ariaLabel: string;
		intro: string;
		skills: string;
		projects: string;
		cvFile: string;
		contact: string;
		github: string;
		linkedin: string;
	};
	theme: {
		switchToLight: string;
		switchToDark: string;
	};
	identity: {
		headline: string;
		location: string;
		openToRelocation: string;
	};
	sections: {
		skills: { title: string; intro: string };
		projects: {
			title: string;
			intro: string;
			smallerTools: string;
			githubCta: string;
			/** CTA for compact secondary-project lines (often “repository” vs “config/source”). */
			githubCtaSmall: string;
			demoYoutubeCta: string;
			/** Appended to project title in screenshot `alt` (localized). */
			projectImageAltSuffix: string;
		};
		cv: { title: string; downloadCv: string; viewCv: string; cvRepo: string };
		contact: { title: string };
	};
	profileLead: string;
	technicalSkills: string[];
	/** Language switcher in the bottom bar. */
	language: {
		ariaLabel: string;
		english: string;
		spanish: string;
	};
};
