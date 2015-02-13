/**
 * Actions available to views for assessment-related functionality.
 */
import AppDispatcher from 'dispatcher/AppDispatcher';

import {submit as performSubmit} from './Api';
import {
    INTERACTED,
    RESET,
    CLEAR,
    SUBMIT_BEGIN,
    SUBMIT_END
} from './Constants';


/**
 *
 * @param {Part} part      Question Part model.
 * @param {any} value      The value
 * @param {Number} [savepointBuffer] The optional delay to buffer the save point call by.
 */
export function partInteracted (part, value, savepointBuffer) {
    AppDispatcher.handleViewAction({ type: INTERACTED, part, value, savepointBuffer });
}


export function resetAssessment (assessment, retainAnswers = false) {
    AppDispatcher.handleViewAction({ type: RESET, assessment, retainAnswers });
}


export function clearAssessmentAnswers (assessment) {
    AppDispatcher.handleViewAction({ type: CLEAR, assessment});
}


export function submit (assessment) {
    AppDispatcher.handleViewAction({type: SUBMIT_BEGIN, assessment});

    performSubmit(assessment)
        .then(response =>
            AppDispatcher.handleRequestAction({type: SUBMIT_END, assessment, response}));
}
