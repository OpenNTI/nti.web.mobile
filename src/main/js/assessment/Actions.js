import AppDispatcher from 'dispatcher/AppDispatcher';

import Api from './Api';
import Constants from './Constants';


/**
 * Actions available to views for assessment-related functionality.
 */
export default {

    /**
     *
     * @param {Part} part      Question Part model.
     * @param {any} value      The value
     * @param {Number} [saveBuffer] The optional delay to buffer the save point call by.
     */
    partInteracted (part, value, saveBuffer) {
        AppDispatcher.handleViewAction({
            type: Constants.INTERACTED,
            part: part,
            value: value,
            savepointBuffer: saveBuffer
        });
    },


    resetAssessment (assessment) {
        AppDispatcher.handleViewAction({
            type: Constants.RESET,
            assessment: assessment
        });
    },


    submit (assessment) {
        AppDispatcher.handleViewAction({
            type: Constants.SUBMIT_BEGIN,
            assessment: assessment
        });

        Api.submit(assessment)
            .then(data =>
                AppDispatcher.handleRequestAction({
                    type: Constants.SUBMIT_END,
                    assessment: assessment,
                    response: data
                })
            );
    }

};
