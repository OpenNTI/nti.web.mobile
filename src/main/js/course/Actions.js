'use strict';
/** @module course/Actions */




var {EventEmitter} = require('events');
var AppDispatcher = require('dispatcher/AppDispatcher');

var NavigationConstants = require('navigation/Constants');
var NavigationActions = require('navigation/Actions');

var Constants = require('./Constants');
var MessagesActions = require('messages/Actions');
var Message = require('messages/Message');

var LibraryApi = require('library/Api');

var NOT_FOUND = Constants.NOT_FOUND;

function dispatch(key, data) {
	var payload = {type: key, response: data};
	AppDispatcher.handleRequestAction(payload);
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

/**
 * Actions available to views for course-related functionality.
 */
module.exports = Object.assign({}, EventEmitter.prototype, {

	setCourse: function(courseId) {
		if(!courseId) {
			NavigationActions.unpublishNav(NavigationConstants.CONTENT_KEY);
			return;
		}
		NavigationActions.setLoading(true);
		LibraryApi.getLibrary()

			.then(function(library) {
				return library.getCourse(courseId) || Promise.reject(NOT_FOUND);
			})

			.then(function(courseEnrollment) {
				dispatch(Constants.SET_ACTIVE_COURSE, courseEnrollment);
				_publishNavFor(courseEnrollment);
			})

			.catch(function(reason) {
				NavigationActions.setLoading(false);
				dispatch(Constants.SET_ACTIVE_COURSE, new Error(reason));
				//Failure
				//TODO: Display error
			});
	}

});
