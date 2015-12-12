import AppDispatcher from 'dispatcher/AppDispatcher';

import {
	PAGE_CHANGED,
	SORT_CHANGED,
	SEARCH_CHANGED,
	ENROLLMENT_TYPE_CHANGED,
	CATEGORY_CHANGED
} from './PerformanceConstants';


export function setSort (sort) {
	dispatch(SORT_CHANGED, {sort});
}

export function setPage (page) {
	dispatch(PAGE_CHANGED, {page});
}

export function setEnrollmentType (enrollmentType) {
	dispatch(ENROLLMENT_TYPE_CHANGED, {enrollmentType});
}

export function setCategory (category) {
	dispatch(CATEGORY_CHANGED, {category});
}

export function setSearch (search) {
	dispatch(SEARCH_CHANGED, {search});
}

function dispatch (type, data) {
	AppDispatcher.handleRequestAction({type, data});
}
