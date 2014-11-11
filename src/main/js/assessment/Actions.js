'use strict';
/** @module assessment/Actions */

var AppDispatcher = require('common/dispatcher/AppDispatcher');

var Constants = require('./Constants');

/**
 * Actions available to views for assessment-related functionality.
 */
module.exports = {

    initQuestionStatus: function () {},


    setPartInteracted: function (part, index) {
        AppDispatcher.handleViewAction({
            type: Constants.INTERACTED,
            part: part,
            index: index
        });
    }

};
