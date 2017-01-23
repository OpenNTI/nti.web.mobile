import {buildPageInfoForContents} from './AssessmentPageGenerator';

//TODO: pass the user to resolve the topic they have access to.
export default function (service, context, assignment) {
	return assignment.resolveTopic()
		.then((topic) => {
			const ntiid = topic.getID();
			const {title, content} = assignment;
			const contents = [];

			if (title) {
				contents.push(`<div class="chapter title">${title}</div>`);
			}

			if (content) {
				contents.push(`<div class="sidebar">${content}</div>`);
			}

			contents.push([`
				<object type="application/vnd.nextthought.app.embededtopic">
					<param name="ntiid" value="${ntiid}"/>
				</object>
			`]);

			return buildPageInfoForContents(service, context, assignment, contents.join(''));
		});
}

