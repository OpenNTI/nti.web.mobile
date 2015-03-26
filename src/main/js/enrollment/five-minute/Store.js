'use strict';

var FiveMinuteInterface = require('nti.lib.interfaces/interface/FiveMinuteInterface');

var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = require('common/constants/Events').CHANGE_EVENT;
var AppDispatcher = require('dispatcher/AppDispatcher');
var Constants = require('./Constants');
var {getService} = require('common/utils');

var Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'enrollment.Store',

	emitChange: function(evt) {
		this.emit(CHANGE_EVENT, evt);
	},

	emitError: function(event) {
		this.emitChange(Object.assign({isError: true}, event));
	},

	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	getAdmissionStatus: function() {
		var me = this.getAdmissionStatus;
		if(!me.promise) {
			me.promise = _getFiveMinuteService().then(function(service) {
				return service.getAdmissionStatus();
			});
		}
		return me.promise;
	}

});

function _getFiveMinuteService() {
	var me = _getFiveMinuteService;
	if (!me.promise) {
		me.promise = getService().then(service =>
			FiveMinuteInterface.fromService(service));
	}
	return me.promise;
}

function _preflightAndSubmit(action) {

	var input = action.payload.data;
	var preflight = _preflight(input);
	var requestAdmission = preflight.then(
		_requestAdmission.bind(null,input),
		function(reason) {
			Store.emitError({
    			type: Constants.errors.PREFLIGHT_ERROR,
				action: action,
				reason: reason
			});
			return Promise.reject(reason);
		}
	);
	requestAdmission.then(
		function(response) {
			Store.emitChange({
    			type: Constants.events.ADMISSION_SUCCESS,
				action: action,
				response: response
			});
		},
		function(reason) {
			var rsn = reason || {};
			// normalize property names for message and field to lowercase.
			['Field', 'Message'].forEach(function(propName) {
				if (rsn[propName] && !rsn[propName.toLowerCase()]) {
					rsn[propName.toLowerCase()] = rsn[propName];
				}
			});
			Store.emitError({
    			type: Constants.errors.REQUEST_ADMISSION_ERROR,
				action: action,
				reason: reason
			});
			return Promise.reject(reason);
		}
	);
}

function _preflight(data) {
	return _getFiveMinuteService().then(function(service) {
		return service.preflight(data);
	});
}

function _requestAdmission(data) {
	return _getFiveMinuteService().then(function(service) {
		return service.requestAdmission(data);
	});
}

function _requestConcurrentEnrollment(data) {
	var requestEnrollment = _getFiveMinuteService().then(function(service) {
		return service.requestConcurrentEnrollment(data);
	});

	requestEnrollment
	.then(
		function(response) {
			Store.emitChange({
				type: Constants.events.CONCURRENT_ENROLLMENT_SUCCESS,
				action: data,
				response: response
			});
		},
		function(reason) {
			Store.emitError({
				type: Constants.events.CONCURRENT_ENROLLMENT_ERROR,
				action: data,
				reason: reason
			});
		}
	);
}

function _doExternalPayment(action) {
	var data = action.payload.data;
	if (!data.ntiCrn || !data.ntiTerm || !data.returnUrl) {
		throw new Error('action payload requires ntiCrn and ntiTerm parameters. Received %O', data);
	}
	var getUrl = _getExternalPaymentUrl(data.link, data.ntiCrn, data.ntiTerm, data.returnUrl);
	getUrl.then(
		function(response) {
			if(response.rel === 'redirect') {
				Store.emitChange({
					type: Constants.events.RECEIVED_PAY_AND_ENROLL_LINK,
					action: action,
					response: response
				});
			}
		},
		function(reason) {
			var rsn = reason || {};
			Store.emitError({
				type: Constants.errors.PAY_AND_ENROLL_ERROR,
				action: action,
				reason: rsn
			});
			return Promise.reject(rsn);
		}
	);
}

function _getExternalPaymentUrl(link, ntiCrn, ntiTerm, returnUrl) {
 	return _getFiveMinuteService().then(function(service) {
 		return service.getPayAndEnroll(link, ntiCrn, ntiTerm, returnUrl);
 	});
}

Store.appDispatch = AppDispatcher.register(function(data) {
    var action = data.action;

    switch(action.type) {
    //TODO: remove all switch statements, replace with functional object literals. No new switch statements.
    	case Constants.actions.REQUEST_CONCURRENT_ENROLLMENT:
    		var fields = action.payload.data;
			_requestConcurrentEnrollment(fields);
    		break;

		case Constants.actions.PREFLIGHT_AND_SUBMIT:
			_preflightAndSubmit(action);
			break;

		case Constants.actions.DO_EXTERNAL_PAYMENT:
			_doExternalPayment(action);
			break;

        default:
            return true;
    }
    return true;
});


module.exports = Store;
