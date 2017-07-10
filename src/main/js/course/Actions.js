import AppDispatcher from 'nti-lib-dispatcher';

import {load as getLibrary} from 'library/Actions';

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

	function buildResponse (o) {
		return {
			taskId: courseId,
			body: o
		};
	}

	dispatch(SET_ACTIVE_COURSE_BEGIN, buildResponse());

	getLibrary()
		.then(library =>
			library.getCourse(courseId) || Promise.reject(NOT_FOUND))
		.then(
			courseEnrollment =>
				dispatch(SET_ACTIVE_COURSE, buildResponse(courseEnrollment)),
			reason =>
				dispatch(SET_ACTIVE_COURSE, buildResponse(new Error(reason.toString())))
		);
}


function dispatch (key, data) {
	AppDispatcher.handleRequestAction({type: key, response: data});
}
