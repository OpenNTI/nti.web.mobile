import AppDispatcher from 'dispatcher/AppDispatcher';

import {getLibrary} from 'library/Api';

import {SET_ACTIVE_COURSE, NOT_FOUND} from './Constants';

/**
 * Actions available to views for course-related functionality.
 */

export function setCourse (courseId) {
	if(!courseId) {
		return;
	}

	getLibrary()
		.then(library => library.getCourse(courseId) || Promise.reject(NOT_FOUND))
		.then(courseEnrollment => {
			dispatch(SET_ACTIVE_COURSE, courseEnrollment);
		})
		.catch(reason => {
			dispatch(SET_ACTIVE_COURSE, new Error(reason));
			//Failure
			//TODO: Display error
		});
}



function dispatch(key, data) {
	AppDispatcher.handleRequestAction({type: key, response: data});
}
