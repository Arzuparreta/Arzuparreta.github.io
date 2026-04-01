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
		cv: { title: string; downloadCv: string; viewCv: string; cvRepo: string };
		contact: { title: string };
	};
	profileLead: string;
	technicalSkills: string[];
	projectCase: {
		stack: string;
		architecture: string;
		keyFeature: string;
	};
};
