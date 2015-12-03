import AppDispatcher from 'dispatcher/AppDispatcher';

import Store from './GradebookStore';

import {
	SORT_CHANGED,
	FILTER_CHANGED,
	GRADEBOOK_BY_ASSIGNMENT_LOADED
} from './GradebookConstants';


export function setSort (sort) {
	dispatch(SORT_CHANGED, {sort});
}

export function setFilter (filter) {
	dispatch(FILTER_CHANGED, {filter});
}

export function load (assignment) {
	assignment.fetchLinkParsed('GradeBookByAssignment', {filter: Store.filter, sortOn: Store.sort})
		.then(gradebookByAssignment => {
			dispatch(GRADEBOOK_BY_ASSIGNMENT_LOADED, {gradebook: gradebookByAssignment});
		});
}

function dispatch (type, data) {
	AppDispatcher.handleRequestAction({type, data});
}
