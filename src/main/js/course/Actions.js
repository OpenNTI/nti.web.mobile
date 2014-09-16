'use strict';
/** @module course/Actions */
var merge = require('react/lib/merge')

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Navigation = require('../navigation');

var Api = require('./Api');
var Constants = require('./Constants');

var LibraryApi = require('../library/Api');


function dispatch(key, data) {
	var payload = {actionType: key, response: data};
	AppDispatcher.handleRequestAction(payload);
}

function _publishNavFor(courseEnrollment) {
	courseEnrollment.getOutline().then(function(d) {
		var root = Array.isArray(d) ? d[0] : d;
		var records = root.contents.map(function(v,i,a) {
			return new Navigation.NavRecord({
				label: v.DCTitle,
				href:v.src
			});
		});
		Navigation.Actions.publishNav(new Navigation.NavRecord({
			label: root.DCTitle || 'Course Outline',
			children: records
		}));
	});
}

/**
 * Actions available to views for course-related functionality.
 */
module.exports = merge(EventEmitter.prototype, {

	setCourse: function(courseId) {
		LibraryApi.getLibrary()

			.then(function(library) {
				return library.findCourse(courseId);
			})

			.then(function(courseEnrollment) {
				dispatch(Constants.SET_ACTIVE_COURSE, courseEnrollment);
				_publishNavFor(courseEnrollment);
			})

			.catch(function(reason) {
				dispatch(Constants.SET_ACTIVE_COURSE, null);
				//Failure
				//TODO: Display error
			});
	}

});
