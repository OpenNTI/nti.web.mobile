import AppDispatcher from 'dispatcher/AppDispatcher';

import Store from './GradebookStore';

import {
	SORT_CHANGED,
	FILTER_CHANGED,
	GRADEBOOK_BY_ASSIGNMENT_LOAD_BEGIN,
	GRADEBOOK_BY_ASSIGNMENT_LOADED
} from './GradebookConstants';


export function setSort (sort) {
	dispatch(SORT_CHANGED, {sort});
}

export function setFilter (filter) {
	dispatch(FILTER_CHANGED, {filter});
}

export function setGrade (assignment, grade) {
	console.deubg('setGrade', assignment, grade);
}

export function load (assignment) {
	dispatch(GRADEBOOK_BY_ASSIGNMENT_LOAD_BEGIN);
	assignment.fetchLinkParsed('GradeBookByAssignment', {filter: Store.filter, sortOn: Store.sort, sortOrder: Store.sortOrder})
		.then(gradebookByAssignment => {
			dispatch(GRADEBOOK_BY_ASSIGNMENT_LOADED, {gradebook: gradebookByAssignment});
		});
}

function dispatch (type, data) {
	AppDispatcher.handleRequestAction({type, data});
}
