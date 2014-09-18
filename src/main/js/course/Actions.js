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

function _navRecordFor(outlineNode,label) {
	var children = null;
	if(Array.isArray(outlineNode.contents)) {
		children = outlineNode.contents.map(function(v,i,a) {
			return _navRecordFor(v);
		});
	}
	return new Navigation.NavRecord({
		label: label || outlineNode.DCTitle,
		href: outlineNode.href ? ($AppConfig.basepath + outlineNode.href) : null,
		children: children
	});
}

function _publishNavFor(courseEnrollment) {
	var props = courseEnrollment.getPresentationProperties();
	var courseTitle = props.title;
	courseEnrollment.getOutline().then(function(d) {
		var root = Array.isArray(d) ? d[0] : d;
		Navigation.Actions.publishNav(Constants.COURSE_NAV_KEY,_navRecordFor(root,courseTitle));
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
