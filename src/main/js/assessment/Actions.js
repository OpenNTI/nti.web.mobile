'use strict';
/** @module assessment/Actions */

var AppDispatcher = require('dispatcher/AppDispatcher');

var Api = require('./Api');
var Constants = require('./Constants');


/**
 * Actions available to views for assessment-related functionality.
 */
module.exports = {

    /**
     *
     * @param {Part} part      Question Part model.
     * @param {any} value      The value
     * @param {Number} [saveBuffer] The optional delay to buffer the save point call by.
     */
    partInteracted: function (part, value, saveBuffer) {
        AppDispatcher.handleViewAction({
            type: Constants.INTERACTED,
            part: part,
            value: value,
            savepointBuffer: saveBuffer
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
