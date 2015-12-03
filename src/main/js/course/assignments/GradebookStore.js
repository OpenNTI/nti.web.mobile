import {
	FILTER_CHANGED,
	GRADEBOOK_BY_ASSIGNMENT_LOADED,
	GRADEBOOK_BY_ASSIGNMENT_UNLOADED,
	SEARCH_CHANGED,
	SORT_CHANGED,
	SORT_ASC,
	SORT_DESC
} from './GradebookConstants';

import StorePrototype from 'common/StorePrototype';

const Clear = Symbol('unset:gradeBookByAssignment');
const SetFilter = Symbol('set:filter');
const SetGradebook = Symbol('set:gradebook');
const SetSearch = Symbol('set:search');
const SetSort = Symbol('set:sort');
const ReverseSortOrder = Symbol('reverseSortOrder');

const filter = Symbol('filter');
const sort = Symbol('sort');
const sortOrder = Symbol('sortOrder');
const search = Symbol('search');
const gradeBookByAssignment = Symbol('gradeBookByAssignment');

class Store extends StorePrototype {

	constructor () {
		super();
		this.registerHandlers({
			[GRADEBOOK_BY_ASSIGNMENT_LOADED]: SetGradebook,
			[FILTER_CHANGED]: SetFilter,
			[SEARCH_CHANGED]: SetSearch,
			[SORT_CHANGED]: SetSort
		});
	}

	get isLoaded () {
		return !!this[gradeBookByAssignment];
	}

	[Clear] () {
		delete this[gradeBookByAssignment];
		this.emitChange({type: GRADEBOOK_BY_ASSIGNMENT_UNLOADED});
	}

	[SetFilter] (payload) {
		this[filter] = payload.action.data.filter;
		this[Clear]();
		// this.emitChange({type: FILTER_CHANGED});
	}

	[SetGradebook] (payload) {
		this[gradeBookByAssignment] = payload.action.data.gradebook;
		this.emitChange({type: GRADEBOOK_BY_ASSIGNMENT_LOADED});
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

	[SetSearch] (payload) {
		this[search] = payload.action.data.search;
		this[Clear]();
		// this.emitChange({type: SEARCH_CHANGED});
	}

	get filter () {
		return this[filter] || 'Open';
	}

	get gradeBookByAssignment () {
		return this[gradeBookByAssignment];
	}

	get sort () {
		return this[sort];
	}

	get sortOrder () {
		return this[sortOrder] || SORT_ASC;
	}
}

export default new Store();
