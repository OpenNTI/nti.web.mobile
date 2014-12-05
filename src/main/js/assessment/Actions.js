'use strict';
/** @module assessment/Actions */

var AppDispatcher = require('dispatcher/AppDispatcher');

var Api = require('./Api');
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


    resetAssessment: function (assessment) {
        AppDispatcher.handleViewAction({
            type: Constants.RESET,
            assessment: assessment
        });
    },


    submit: function (assessment) {
        AppDispatcher.handleViewAction({
            type: Constants.SUBMIT_BEGIN,
            assessment: assessment
        });

        Api.submit(assessment)
            .then(function(data) {
                AppDispatcher.handleRequestAction({
                    type: Constants.SUBMIT_END,
                    assessment: assessment,
                    response: data
                });
            });
    }

};
