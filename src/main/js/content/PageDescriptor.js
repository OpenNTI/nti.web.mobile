import {CommonSymbols} from 'nti.lib.interfaces';
let {Service} = CommonSymbols;

const UserData = Symbol('UserData');

export default class PageDescriptor {
	constructor (ntiid, data) {
		this.ntiid = ntiid;

		Object.assign(this, {
			[Symbol.for('Created')]: new Date(),
			[Service]: data.pageInfo[Service],
			[UserData]: data.userDataStore,

			content: {
				raw: data.content,
				parsed: data.body
			}
		});

		delete data.content;
		delete data.body;
		delete data.userDataStore;

		Object.assign(this, data);
	}


	getID () { return this.ntiid; }


	getTitle () {
		let toc = this.tableOfContents;
		let node = toc && toc.getNode(this.ntiid);
		return node && node.get('label');
	}


	getPageSource (id) { return this.tableOfContents.getPageSource(id); }


	getTableOfContents () { return this.tableOfContents; }


	getBodyParts () { return this.content.parsed; }


	getPageStyles () { return this.styles; }


	getUserDataStore () {
		return this[UserData];
	}


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
