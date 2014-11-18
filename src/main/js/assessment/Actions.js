'use strict';
/** @module assessment/Actions */

var AppDispatcher = require('dispatcher/AppDispatcher');

var Constants = require('./Constants');

/**
 * Actions available to views for assessment-related functionality.
 */
module.exports = {


    partInteracted: function (part, value) {
        AppDispatcher.handleViewAction({
            type: Constants.INTERACTED,
            part: part,
            value: value
        });
    },


    restAssessment: function (assessment) {
        AppDispatcher.handleViewAction({
            type: Constants.RESET,
            assessment: assessment
        });
    }

};
