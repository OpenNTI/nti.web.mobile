import {buildPageInfoForContents} from './AssessmentPageGenerator';

const EMBED_TYPE = 'application/vnd.nextthought.app.embededtopic';

function getBaseContents (assignment) {
	const {title, content} = assignment;
	const contents = [];

	if (title) {
		contents.push(`<div class="chapter title">${title}</div>`);
	}

	if (content) {
		contents.push(`<div class="sidebar">${content}</div>`);
	}

	return contents;
}

//TODO: pass the user to resolve the topic they have access to.
export default function (service, context, assignment) {
	return assignment.resolveTopic()
		.then(() => Promise.reject())
		.then((topic) => {
			const ntiid = topic.getID();
			const contents = getBaseContents(assignment);

			contents.push([`
				<object type=${EMBED_TYPE}>
					<param name="ntiid" value="${ntiid}"/>
				</object>
			`]);

			return buildPageInfoForContents(service, context, assignment, contents.join(''));
		})
		.catch(() => {
			const contents = getBaseContents(assignment);

			contents.push([`
				<object type=${EMBED_TYPE}></object>
			`]);

			return buildPageInfoForContents(service, context, assignment, contents.join(''));
		});
}

