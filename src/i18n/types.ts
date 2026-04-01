export type CvWorkItem = {
	title: string;
	stack: string;
	bullets: string[];
};

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
		selectedWork: string;
		repositories: string;
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
		selectedWork: { title: string; intro: string };
		projects: { title: string; intro: string };
		education: { title: string };
		cv: { title: string; downloadCv: string; viewCv: string; cvRepo: string };
		contact: { title: string };
	};
	profileLead: string;
	technicalSkills: string[];
	cvWorkSamples: CvWorkItem[];
	education: {
		title: string;
		institution: string;
		note: string;
	};
	projectCase: {
		repository: string;
		problem: string;
		approach: string;
		stack: string;
		reflection: string;
	};
};
