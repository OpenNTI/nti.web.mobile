import AppDispatcher from 'dispatcher/AppDispatcher';

import Store from './GradebookStore';

import {
	SORT_CHANGED,
	SEARCH_CHANGED,
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

export function setSearch (search) {
	dispatch(SEARCH_CHANGED, {search});
}

export function setGrade (assignmentId, userId, grade) {
	console.debug('setGrade not yet implemented', assignmentId, userId, grade);
}

export function excuseGrade (assignmentId, userId) {
	console.debug('excuse grade action not yet implemented', assignmentId, userId);
}

export function resetAssignment (assignmentId, userId) {
	console.debug('reset assignment action not yet implemented', assignmentId, userId);
}

export function load (assignment) {
	dispatch(GRADEBOOK_BY_ASSIGNMENT_LOAD_BEGIN);

	const params = {
		filter: Store.filter,
		sortOn: Store.sort,
		sortOrder: Store.sortOrder,
		batchStart: Store.batchStart,
		batchSize: Store.batchSize,
		search: Store.search
	};

	assignment.fetchLinkParsed('GradeBookByAssignment', params)
		.then(gradebookByAssignment => {
			dispatch(GRADEBOOK_BY_ASSIGNMENT_LOADED, {gradebook: gradebookByAssignment});
		});
}

function dispatch (type, data) {
	AppDispatcher.handleRequestAction({type, data});
}
