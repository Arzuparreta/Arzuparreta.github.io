export type Messages = {
	meta: {
		title: string;
		description: string;
	};
	a11y: {
		skipToContent: string;
	};
	nav: {
		ariaLabel: string;
		intro: string;
		skills: string;
		projects: string;
		education: string;
		cvFile: string;
		contact: string;
		github: string;
	};
	identity: {
		headline: string;
		location: string;
		openToRelocation: string;
	};
	sections: {
		skills: { title: string; intro: string };
		projects: { title: string; intro: string; smallerTools: string };
		education: { title: string };
		cv: { title: string; downloadCv: string; viewCv: string; cvRepo: string };
		contact: { title: string };
	};
	profileLead: string;
	technicalSkills: string[];
	education: {
		title: string;
		institution: string;
		note: string;
	};
	projectCase: {
		github: string;
		viewLive: string;
		stack: string;
		architecture: string;
		keyFeature: string;
	};
};
