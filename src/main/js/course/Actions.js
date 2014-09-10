'use strict';
/** @module course/Actions */
var merge = require('react/lib/merge')

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var NavigationActions = require('../navigation/NavigationActions');

var Api = require('./Api');
var Constants = require('./Constants');

var LibraryApi = require('../library/Api');


function dispatch(key, data) {
    var payload = {actionType: key, response: data};
    AppDispatcher.handleRequestAction(payload);
}

function navFor(courseEnrollment) {
    return courseEnrollment;
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
                NavigationActions.publishNav(navFor(courseEnrollment));
            })

            .catch(function(reason) {
                dispatch(Constants.SET_ACTIVE_COURSE, null);
                //Failure
                //TODO: Display error
            });
    }

});
