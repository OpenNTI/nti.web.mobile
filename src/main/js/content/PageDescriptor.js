import {Service} from 'dataserverinterface/CommonSymbols';

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


	getPageSource (id){ return this.tableOfContents.getPageSource(id);}


	getTableOfContents () { return this.tableOfContents; }


	getBodyParts () { return this.content.parsed; }


	getPageStyles () { return this.styles; }


	getAssessmentQuestion (questionId) {
		return this.pageInfo.getAssessmentQuestion(questionId);
	}


	getSubmittableAssessment () {
		var items = this.pageInfo.AssessmentItems || [];
		return items.reduce((v, item) =>
			v || (item.isSubmittable && item), null);
	}
}
