import {
	FILTER_CHANGED,
	GRADEBOOK_BY_ASSIGNMENT_LOADED,
	GRADEBOOK_BY_ASSIGNMENT_UNLOADED,
	SEARCH_CHANGED,
	SORT_CHANGED
} from './GradebookConstants';

import StorePrototype from 'common/StorePrototype';

const Clear = Symbol('unset:gradeBookByAssignment');
const SetFilter = Symbol('set:filter');
const SetGradebook = Symbol('set:gradebook');
const SetSearch = Symbol('set:search');
const SetSort = Symbol('set:sort');

const filter = Symbol('filter');
const sort = Symbol('sort');
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
		this[sort] = payload.action.data.sort;
		this[Clear]();
		// this.emitChange({type: SORT_CHANGED});
	}

	[SetSearch] (payload) {
		this[search] = payload.action.data.search;
		this[Clear]();
		// this.emitChange({type: SEARCH_CHANGED});
	}

	get filter () {
		return this[filter] || 'Open';
	}

	get sort () {
		return this[sort];
	}

	get gradeBookByAssignment () {
		return this[gradeBookByAssignment];
	}
}

export default new Store();
