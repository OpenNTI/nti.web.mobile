'use strict';
/** @module course/Actions */




var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Navigation = require('navigation');

var Constants = require('./Constants');
var Messages = require('messages');

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
			Navigation.Actions.publishNav(Navigation.Constants.CONTENT_KEY, root);
		})
		.catch(e => {
			console.error('error attempting to get course outline. %O',e);
			var messageCat = 'course:nav';
			Messages.Actions.clearMessages({
				category: messageCat
			});
			Messages.Actions.addMessage(
				new Messages.Message('An error occurred. Unable to load course outline.', {
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
			Navigation.Actions.unpublishNav(Navigation.Constants.CONTENT_KEY);
			return;
		}
		Navigation.Actions.setLoading(true);
		LibraryApi.getLibrary()

			.then(function(library) {
				return library.getCourse(courseId) || Promise.reject(NOT_FOUND);
			})

			.then(function(courseEnrollment) {
				dispatch(Constants.SET_ACTIVE_COURSE, courseEnrollment);
				_publishNavFor(courseEnrollment);
			})

			.catch(function(reason) {
				Navigation.Actions.setLoading(false);
				dispatch(Constants.SET_ACTIVE_COURSE, new Error(reason));
				//Failure
				//TODO: Display error
			});
	}

});
