import {
	ENROLLMENT_TYPE_CHANGED,
	CATEGORY_CHANGED,
	PAGE_CHANGED,
	STORE_CHANGE,
	SEARCH_CHANGED,
	SORT_CHANGED,
	SORT_ASC,
	SORT_DESC
} from './PerformanceConstants';

import StorePrototype from 'common/StorePrototype';

const Clear = Symbol('clear');
const Flush = Symbol('flush');
const SetEnrollmentType = Symbol('set:enrollmentType');
const SetCategory = Symbol('set:category');
const SetPage = Symbol('set:page');
const SetSearch = Symbol('set:search');
const SetSort = Symbol('set:sort');
const ReverseSortOrder = Symbol('reverseSortOrder');

const enrollmentType = Symbol('enrollmentType');
const category = Symbol('category');
const page = Symbol('page');
const batchSize = Symbol('batchSize');
const sort = Symbol('sort');
const sortOrder = Symbol('sortOrder');
const search = Symbol('search');

class Store extends StorePrototype {

	constructor () {
		super();
		this.registerHandlers({
			[ENROLLMENT_TYPE_CHANGED]: SetEnrollmentType,
			[CATEGORY_CHANGED]: SetCategory,
			[SEARCH_CHANGED]: SetSearch,
			[SORT_CHANGED]: SetSort,
			[PAGE_CHANGED]: SetPage
		});
	}

	// same as Clear but doesn't emit a change event
	[Flush] () {
		this[Clear](false);
	}

	[Clear] (emitChange = true) {
		// delete this[gradeBookByAssignment];
		if(emitChange) {
			this.emitChange({type: STORE_CHANGE});
		}
	}

	[SetEnrollmentType] (payload) {
		const current = this.enrollmentType;
		const value = payload.action.data.enrollmentType;
		if (current !== value) {
			console.debug('SetEnrollmentType: %O', value);
			this[enrollmentType] = value;
			this[Clear]();
		}
	}

	[SetCategory] (payload) {
		const current = this.category;
		const value = payload.action.data.category;
		if (current !== value) {
			console.debug('SetCategory: %O', value);
			this[category] = value;
			this[Clear]();
		}
	}


	[SetSort] (payload) {
		const value = payload.action.data.sort;
		if (this.sort === value) {
			this[ReverseSortOrder]();
		}
		this[sort] = value;
		this[Clear]();
		// this.emitChange({type: SORT_CHANGED});
	}

	[ReverseSortOrder] () {
		this[sortOrder] = this.sortOrder === SORT_ASC ? SORT_DESC : SORT_ASC;
	}


	[SetPage] (payload) {
		console.log('performance store: set page', payload);
		const value = payload.action.data.page;
		this[page] = value;
		this[Clear]();
	}

	[SetSearch] (payload) {
		console.log('performance store: set search', payload);
		this[search] = payload.action.data.search;
		this[Clear]();
		// this.emitChange({type: SEARCH_CHANGED});
	}

	get batchSize () {
		return this[batchSize] || 50;
	}

	get batchStart () {
		return (this.page - 1) * this.batchSize;
	}

	get count () {
		let items = (this.gradeBookByAssignment || {}).Items || [];
		return items.length;
	}

	get total () {
		return this.gradeBookByAssignment ? this.gradeBookByAssignment.TotalItemCount : 0;
	}

	get page () {
		return this[page] || 1;
	}

	get search () {
		return this[search];
	}

	get sort () {
		return this[sort] || 'LastName';
	}

	get sortOrder () {
		return this[sortOrder] || SORT_ASC;
	}
}

export default new Store();
