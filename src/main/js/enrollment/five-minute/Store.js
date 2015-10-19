import {EventEmitter} from 'events';

import FiveMinuteInterface from 'nti.lib.interfaces/interface/FiveMinuteInterface';

import {CHANGE_EVENT} from 'common/constants/Events';
import {getService} from 'common/utils';
import AppDispatcher from 'dispatcher/AppDispatcher';

import * as Constants from './Constants';

const Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'enrollment.Store',

	emitChange (evt) {
		this.emit(CHANGE_EVENT, evt);
	},

	emitError (event) {
		this.emitChange(Object.assign({isError: true}, event));
	},

	addChangeListener (callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	getAdmissionStatus () {
		let me = this.getAdmissionStatus;
		if(!me.promise) {
			me.promise = getFiveMinuteService().then(service => service.getAdmissionStatus());
		}
		return me.promise;
	}

});


function getFiveMinuteService () {
	let me = getFiveMinuteService;
	if (!me.promise) {
		me.promise = getService().then(service =>
			FiveMinuteInterface.fromService(service));
	}
	return me.promise;
}


function preflightAndSubmit (action) {

	let input = action.payload.data;

	preflight(input)
		.then(
			() => requestAdmission(input),
			reason => {
				Store.emitError({type: Constants.PREFLIGHT_ERROR, action, reason});
				return Promise.reject(reason);
			}
		)
		.then(
			response => Store.emitChange({ type: Constants.ADMISSION_SUCCESS, action, response }),
			reason => {
				let rsn = reason || {};
				// normalize property names for message and field to lowercase.
				['Field', 'Message'].forEach(propName => {
					if (rsn[propName] && !rsn[propName.toLowerCase()]) {
						rsn[propName.toLowerCase()] = rsn[propName];
					}
				});
				Store.emitError({type: Constants.REQUEST_ADMISSION_ERROR, action, reason});
				return Promise.reject(reason);
			}
		);
}

function preflight (data) {
	return getFiveMinuteService().then(service => service.preflight(data));
}

function requestAdmission (data) {
	return getFiveMinuteService().then(service => service.requestAdmission(data));
}

function requestConcurrentEnrollment (action) {
	let requestEnrollment = getFiveMinuteService().then(service => service.requestConcurrentEnrollment(action));

	requestEnrollment.then(
		response => Store.emitChange({type: Constants.CONCURRENT_ENROLLMENT_SUCCESS, action, response}),
		reason => Store.emitError({type: Constants.CONCURRENT_ENROLLMENT_ERROR, action, reason})
	);
}

function externalPayment (action) {
	let data = action.payload.data;

	if (!data.ntiCrn || !data.ntiTerm || !data.returnUrl) {
		throw new Error('action payload requires ntiCrn and ntiTerm parameters. Received %O', data);
	}

	let getUrl = getExternalPaymentUrl(data.link, data.ntiCrn, data.ntiTerm, data.returnUrl);

	getUrl.then(
		response => {
			if(response.rel === 'redirect') {
				Store.emitChange({type: Constants.RECEIVED_PAY_AND_ENROLL_LINK, action, response});
			}
		},
		(reason = {}) => {
			Store.emitError({type: Constants.PAY_AND_ENROLL_ERROR, action, reason});
			return Promise.reject(reason);
		}
	);
}

function getExternalPaymentUrl (link, ntiCrn, ntiTerm, returnUrl) {
	return getFiveMinuteService().then(service =>
		service.getPayAndEnroll(link, ntiCrn, ntiTerm, returnUrl));
}

Store.appDispatch = AppDispatcher.register(data => {
	let action = data.action;

	switch(action.type) {
	//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
	case Constants.REQUEST_CONCURRENT_ENROLLMENT:
		requestConcurrentEnrollment(action.payload.data);
		break;

	case Constants.PREFLIGHT_AND_SUBMIT:
		preflightAndSubmit(action);
		break;

	case Constants.DO_EXTERNAL_PAYMENT:
		externalPayment(action);
		break;

	default:
		return true;
	}
	return true;
});


export default Store;
