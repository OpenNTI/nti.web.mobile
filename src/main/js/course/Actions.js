'use strict';
/** @module course/Actions */
var Promise = global.Promise || require('es6-promise').Promise;

var merge = require('react/lib/merge');

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Navigation = require('navigation');

var Constants = require('./Constants');
var Messages = require('common/messages');

var LibraryApi = require('library/Api');

var NOT_FOUND = Constants.NOT_FOUND;

function dispatch(key, data) {
	var payload = {type: key, response: data};
	AppDispatcher.handleRequestAction(payload);
}

function _navRecordFor(outlineNode,navbarTitle) {
	var children = null;
	if(Array.isArray(outlineNode.contents)) {
		children = outlineNode.contents.map(function(v) {
			return _navRecordFor(v);
		});
	}
	return new Navigation.NavRecord({
		label: outlineNode.DCTitle,
		navbarTitle: navbarTitle,
		href: outlineNode.href,
		children: children
	});
}

function _publishNavFor(courseEnrollment) {
	var props = courseEnrollment.getPresentationProperties();

	courseEnrollment.getOutline()
		.catch(function (e) {
			return e === 'Preview' ? [] : Promise.reject(e);
		})
		.then(function(d) {
			var root = Array.isArray(d) ? d[0] : d;
			debugger;
			Navigation.Actions.publishNav(Navigation.Constants.CONTENT_KEY,_navRecordFor(root,props.title));
		})
		.catch(function(e) {
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
module.exports = merge(EventEmitter.prototype, {

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
