import {getModel} from '@nti/lib-interfaces';

const PageInfo = getModel('pageinfo');

export function buildPageInfoForContents (service, context, assessment, contents) {
	const ntiid = assessment.getID();

	const parent = assessment.parent('ContentPackageBundle');
	const Bundle = parent && parent.ContentPackageBundle;
	const Package = Bundle && Bundle.ContentPackages[0];
	/*
	* NTI-4705: Placeholder is there for courses that are newly created with no content packages.
	* This allows for assignments to be opened in an empty course.
	*/
	const ContentPackageNTIID = Package && (!Package.isRenderable || Package.isRendered) ? Package.NTIID : 'placeholder';

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

	const pi = new PageInfo(service, context, {
		ContentPackageNTIID,
		ID: ntiid,
		NTIID: ntiid
	});

	pi.AssessmentItems = [assessment];
	pi.getContent = () => Promise.resolve(content);
	pi.getUserData = () => null;
	return pi;
}


export default function generate (service, context, assessment) {
	const contents = getContentsForAssessment(assessment);

	return buildPageInfoForContents(service, context, assessment, contents);
}


function getContentsForAssessment (assessment) {
	const questions = assessment ? assessment.getQuestions() : [];
	const {title, content} = assessment;
	const contents = [];

	if (title) {
		contents.push(`<div class="chapter title">${title}</div>`);
	}

	if (content) {
		contents.push(`<div class="sidebar assignment-description">${content}</div>`);
	}

	for (let index = 0; index < questions.length; index++) {
		let question = questions[index];
		const ntiid = question.getID();
		contents.push(`
			<object type="${question.MimeType}">
				<param name="ntiid" value="${ntiid}"/>
				<param name="number" value="${index + 1}"/>
			</object>
		`);
	}

	return contents.join('');
}
