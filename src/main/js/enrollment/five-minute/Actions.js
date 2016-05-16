import AppDispatcher from 'nti-lib-dispatcher';
import {
	PREFLIGHT_AND_SUBMIT,
	REQUEST_CONCURRENT_ENROLLMENT,
	DO_EXTERNAL_PAYMENT
} from './Constants';


export function preflightAndSubmit (data) {
	dispatch(PREFLIGHT_AND_SUBMIT, { data });
}

export function requestConcurrentEnrollment (data) {
	dispatch(REQUEST_CONCURRENT_ENROLLMENT, { data });
}

	// @param {object} data should inlude props for link, ntiCrn, and ntiTerm
export function doExternalPayment (data) {
	dispatch(DO_EXTERNAL_PAYMENT, { data });
}


function dispatch (type, payload) {
	AppDispatcher.handleRequestAction({type, payload});
}
