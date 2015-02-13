import AppDispatcher from 'dispatcher/AppDispatcher';

import NavigationConstants from 'navigation/Constants';
import NavigationActions from 'navigation/Actions';

import MessagesActions from 'messages/Actions';
import Message from 'messages/Message';

import {getLibrary} from 'library/Api';

import {SET_ACTIVE_COURSE, NOT_FOUND} from './Constants';

/**
 * Actions available to views for course-related functionality.
 */

export function setCourse (courseId) {
	if(!courseId) {
		NavigationActions.unpublishNav(NavigationConstants.CONTENT_KEY);
		return;
	}

	NavigationActions.setLoading(true);

	getLibrary()

		.then(library => library.getCourse(courseId) || Promise.reject(NOT_FOUND))

		.then(courseEnrollment => {
			dispatch(SET_ACTIVE_COURSE, courseEnrollment);
			_publishNavFor(courseEnrollment);
		})

		.catch(reason => {
			NavigationActions.setLoading(false);
			dispatch(SET_ACTIVE_COURSE, new Error(reason));
			//Failure
			//TODO: Display error
		});
}



function dispatch(key, data) {
	AppDispatcher.handleRequestAction({type: key, response: data});
}


function _publishNavFor(courseEnrollment) {
	courseEnrollment.getOutline()
		.catch(e => e === 'Preview' ? [{}] : Promise.reject(e))
		.then(d => {
			var root = Array.isArray(d) ? d[0] : d;
			NavigationActions.publishNav(NavigationConstants.CONTENT_KEY, root);
		})
		.catch(e => {
			console.error('error attempting to get course outline. %O',e);
			var messageCat = 'course:nav';
			MessagesActions.clearMessages({
				category: messageCat
			});
			MessagesActions.addMessage(
				new Message('An error occurred. Unable to load course outline.', {
					category: messageCat
				})
			);
		});
}
