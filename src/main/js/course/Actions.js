import AppDispatcher from 'dispatcher/AppDispatcher';

import {getLibrary} from 'library/Api';

import {
	SET_ACTIVE_COURSE,
	SET_ACTIVE_COURSE_BEGIN,
	NOT_FOUND
} from './Constants';

/**
 * Actions available to views for course-related functionality.
 */

export function setCourse (courseId) {
	if(!courseId) {
		return;
	}

	dispatch(SET_ACTIVE_COURSE_BEGIN, courseId);

	getLibrary()
		.then(library => library.getCourse(courseId) || Promise.reject(NOT_FOUND))
		.then(
			courseEnrollment => dispatch(SET_ACTIVE_COURSE, courseEnrollment),
			reason => dispatch(SET_ACTIVE_COURSE, new Error(reason))
			);
}


function dispatch(key, data) {
	AppDispatcher.handleRequestAction({type: key, response: data});
}
