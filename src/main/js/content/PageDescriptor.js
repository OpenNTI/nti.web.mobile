import {Service} from 'nti-lib-interfaces';

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


	getAssessmentQuestion (questionId) {
		return this.pageInfo.getAssessmentQuestion(questionId);
	}


	getBodyParts () { return this.content.parsed; }


	getID () { return this.ntiid; }


	getCanonicalID () { //Asking for a PageInfo on Assessment items (questions
		// and sets redirect to the containing page... so the requested ID will
		//  not match the actual ID)  This allows us to get the "Real ID".
		return this.pageInfo.getID();
	}


	getPageSource (id) { return this.tableOfContents.getPageSource(id); }


	getPageStyles () { return this.styles; }


	getSharingPreferences () {
		return this.pageInfo.getSharingPreferences();
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


	getTableOfContents () { return this.tableOfContents; }


	getTitle () {
		let toc = this.tableOfContents;
		let node = toc && toc.getNode(this.ntiid);
		return node && node.get('label');
	}


	getUserDataStore () {
		return this[UserData];
	}
}
