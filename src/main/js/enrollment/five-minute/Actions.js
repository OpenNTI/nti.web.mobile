import AppDispatcher from 'dispatcher/AppDispatcher';
import {
	PREFLIGHT_AND_SUBMIT,
	REQUEST_CONCURRENT_ENROLLMENT,
	DO_EXTERNAL_PAYMENT
} from './Constants';

export default {
	preflightAndSubmit (data) {
		dispatch(PREFLIGHT_AND_SUBMIT, { data });
	},

	requestConcurrentEnrollment (data) {
		dispatch(REQUEST_CONCURRENT_ENROLLMENT, { data });
	},

	// @param {object} data should inlude props for link, ntiCrn, and ntiTerm
	doExternalPayment (data) {
		dispatch(DO_EXTERNAL_PAYMENT, { data });
	}
};

function dispatch(type, payload) {
	AppDispatcher.handleRequestAction({type, payload});
}
