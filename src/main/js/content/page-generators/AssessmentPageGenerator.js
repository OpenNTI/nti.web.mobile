import {getModel} from 'nti-lib-interfaces';

const PageInfo = getModel('pageinfo');

export default function generate (service, assessment) {
	const contents = getContentsForAssessment(assessment);
	const ntiid = assessment.getID();

	const parent = assessment.parent('ContentPackageBundle');
	const Bundle = parent && parent.ContentPackageBundle;
	const Package = Bundle && Bundle.ContentPackages[0];
	const ContentPackageNTIID = Package && Package.NTIID;

	const content = `
		<head>
			<title>${assessment.title}</title>
		</head>
		<body>
			<div class="page-contents">
				<div data-ntiid="${ntiid}" ntiid="${ntiid}">
					${contents}
				</div>
			</div>
		</body>
	`;

	const pi = new PageInfo(service, {
		ContentPackageNTIID,
		ID: ntiid,
		NTIID: ntiid
	});

	pi.AssessmentItems = [assessment];
	pi.getContent = () => Promise.resolve(content);
	pi.getUserData = () => null;
	return pi;
}



function getContentsForAssessment (assessment) {
	const questions = assessment ? assessment.getQuestions() : [];
	const {title, content} = assessment;
	const contents = [];

	if (title) {
		contents.push(`<div class="chapter title">${title}</div>`);
	}

	if (content) {
		contents.push(`<div class="sidebar">${content}</div>`);
	}

	for (let question of questions) {
		const ntiid = question.getID();
		console.log(question);
		contents.push(`<object data="${ntiid}" data-ntiid="${ntiid}" type="${question.MimeType}"></object>`);
	}

	return contents.join('');
}
