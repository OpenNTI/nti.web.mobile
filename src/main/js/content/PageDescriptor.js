import {Service} from 'nti.lib.interfaces/CommonSymbols';

export default class PageDescriptor {
	constructor (ntiid, data) {
		this.ntiid = ntiid;

		Object.assign(this,{
			[Symbol.for('Created')]: new Date(),
			[Service]: data.pageInfo[Service],

			content: {
				raw: data.content,
				parsed: data.body
			}
		});

		delete data.content;
		delete data.body;

		Object.assign(this, data);
	}


	getID () {return this.ntiid;}


	getTitle () {
		let toc = this.tableOfContents;
		let node = toc && toc.getNode(this.ntiid);
		let attrs = node && node.attrib;
		return attrs && attrs.label;
	}


	getPageSource (id){ return this.tableOfContents.getPageSource(id);}


	getTableOfContents () { return this.tableOfContents; }


	getBodyParts () { return this.content.parsed; }


	getPageStyles () { return this.styles; }


	getAssessmentQuestion (questionId) {
		return this.pageInfo.getAssessmentQuestion(questionId);
	}

	//This should only ever return Assignment, QuestionSet or falsy.
	//Individual Question submission is handled within the scope of
	//the question widget, not the page.
	getSubmittableAssessment () {
		let items = this.pageInfo.AssessmentItems || [];
		let search = (v, item) => v || (
				item.isSubmittable &&
				!item.isQuestion ?
					item :
					v);

		return items.reduce(search,	null);
	}
}
