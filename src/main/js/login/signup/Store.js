

import AppDispatcher from 'dispatcher/AppDispatcher';
import {EventEmitter} from 'events';

import {getServer, getBasePath} from 'common/utils';

import * as Constants from './Constants';
let Actions = Constants.actions;

import {CHANGE_EVENT, ERROR_EVENT} from 'common/constants/Events';

import _fieldConfig from './configs/signup';

let _errors = [];

let Store = Object.assign({}, EventEmitter.prototype, {

	emitChange: function(evt) {
		console.log('Store: emitting change');
		this.emit(CHANGE_EVENT, evt);
	},

	/**
	* @param {function} callback
	*/
	addChangeListener: function(callback) {
		console.log('Store: adding change listener');
		this.on(CHANGE_EVENT, callback);
	},

	/**
	* @param {function} callback
	*/
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	getErrors: function() {
		return _errors;
	},

	_addError: function(error) {
		_errors.push(error);
		this.emitChange({
			type: ERROR_EVENT,
			errors: _errors
		});
	},

	_clearErrors: function() {
		if (_errors.length > 0) {
			_errors.length = 0;
			this.emitChange({
				type: ERROR_EVENT
			});
		}
	},

	_accountCreated: function(result) {
		this._clearErrors();
		this.emitChange({
			type: 'created',
			details: result
		});
	},

	getUserAgreementUrl: function() {
		// return Promise.resolve('https://docs.google.com/document/pub?id=1rM40we-bbPNvq8xivEKhkoLE7wmIETmO4kerCYmtISM&embedded=true');
		return Promise.resolve( getBasePath() + 'api/user-agreement/');
	},

	getUserAgreement: function() {
		return this.getUserAgreementUrl().then(function(url) {
			//BAD: TODO: Fix to use get() from Service!
			return getServer().get(url)
				.catch(function(reason) {
					if (reason.responseJSON) {
						reason = reason.responseJSON.message;
					}
					return Promise.reject(reason);
				});
		});
		// Promise.resolve('https://docs.google.com/document/pub?id=1rM40we-bbPNvq8xivEKhkoLE7wmIETmO4kerCYmtISM&embedded=true');
	},

	getPrivacyUrl: function() {
		return 'https://docs.google.com/document/pub?id=1W9R8s1jIHWTp38gvacXOStsfmUz5TjyDYYy3CVJ2SmM';
	},

	getFormConfig: function() {
		return Promise.resolve(_fieldConfig);
	}
});

function fieldsMatch(value1, value2) {
	if( !value1 && !value2) {
		return true;
	}
	return value1 === value2;
}

function _clientSidePreflight(fields) {
	return new Promise(function(fulfill, reject) {
		if (!fieldsMatch(fields.password, fields.password2)) {
			let error = {
				field: 'password2',
				message: 'Passwords do not match.'
			};
			Store._addError(error);
			reject(error);
			return;
		}
		fulfill(fields);
	});
}

function _serverSidePreflight(fields) {
	return new Promise(function(fulfill, reject) {
		getServer().preflightAccountCreate(fields).then(function(result) {
			fulfill(result);
		}, function(result) {
			console.debug('Store received preflight result: %O', result);
			Store._clearErrors();
			if (result.statusCode === 422 || result.statusCode === 409) {
				Store._addError(result);
			}
			reject(result);
		});
	});
}

function _preflight(fields) {
	return _clientSidePreflight(fields).then(_serverSidePreflight);
}

function _createAccount(fields) {

	function success(result) {
		Store._accountCreated(result);
	}

	function fail(result) {
		console.log('Account creation fail: %O', result);
		if (Math.floor(result.statusCode / 100) === 4) {
			console.debug(result);
			let res = JSON.parse(result.response);
			Store._addError({
				field: res.field,
				message: res.message
			});
		}
	}

	return getServer().createAccount(fields)
	.then(success, fail);

}

function _preflightCreateAccount(fields) {
	_preflight(fields)
		.then(_createAccount.bind(null, fields))
		.catch(function(reason) {
			console.debug(reason);
		});
}

AppDispatcher.register(function(payload) {
	let action = payload.action;

	switch (action.type) {
	//TODO: remove all switch statements, replace with functional object literals. No new switch statements.

		case Actions.PREFLIGHT:
			_preflight(action.fields);
		break;

		case Actions.CREATE_ACCOUNT:
			_createAccount(action.fields);
		break;

		case Actions.PREFLIGHT_AND_CREATE_ACCOUNT:
			_preflightCreateAccount(action.fields);
		break;

		case Actions.CLEAR_ERRORS:
			Store._clearErrors();
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

export default Store;
