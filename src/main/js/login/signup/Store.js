import AppDispatcher from 'dispatcher/AppDispatcher';
import {EventEmitter} from 'events';

import {getServer} from 'common/utils';

import * as Constants from './Constants';

import {CHANGE_EVENT, ERROR_EVENT} from 'common/constants/Events';

let errors = [];

const addError = 'signupStore:addError';
const clearErrors = 'signupStore:clearErrors';
const accountCreated = 'signupStore:accountCreated';

let Store = Object.assign({}, EventEmitter.prototype, {

	emitChange (evt) {
		console.log('Store: emitting change');
		this.emit(CHANGE_EVENT, evt);
	},


	addChangeListener (callback) {
		console.log('Store: adding change listener');
		this.on(CHANGE_EVENT, callback);
	},


	removeChangeListener (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	getErrors () {
		return errors;
	},

	[addError] (error) {
		errors.push(error);
		this.emitChange({
			type: ERROR_EVENT,
			errors: errors
		});
	},

	[clearErrors] () {
		if (errors.length > 0) {
			errors.length = 0;
			this.emitChange({
				type: ERROR_EVENT
			});
		}
	},

	[accountCreated] (result) {
		this[clearErrors]();
		this.emitChange({
			type: 'created',
			details: result
		});
	},

	getUserAgreementUrl (basePath) {
		if (!basePath) {
			throw new Error('basePath is required.');
		}
		// return Promise.resolve('https://docs.google.com/document/pub?id=1rM40we-bbPNvq8xivEKhkoLE7wmIETmO4kerCYmtISM&embedded=true');
		return Promise.resolve( basePath + 'api/user-agreement/');
	},

	getUserAgreement (basePath) {
		return this.getUserAgreementUrl(basePath).then(url => {
			//BAD: TODO: Fix to use get() from Service!
			return getServer().get(url)
				.catch(reason => {
					if (reason.responseJSON) {
						reason = reason.responseJSON.message;
					}
					return Promise.reject(reason);
				});
		});
		// Promise.resolve('https://docs.google.com/document/pub?id=1rM40we-bbPNvq8xivEKhkoLE7wmIETmO4kerCYmtISM&embedded=true');
	},

	getPrivacyUrl () {
		return 'https://docs.google.com/document/pub?id=1W9R8s1jIHWTp38gvacXOStsfmUz5TjyDYYy3CVJ2SmM';
	}
});

function fieldsMatch (value1, value2) {
	if( !value1 && !value2) {
		return true;
	}
	return value1 === value2;
}

function clientSidePreflight (fields) {
	return new Promise((fulfill, reject) => {
		if (!fieldsMatch(fields.password, fields.password2)) {
			let error = {
				field: 'password2',
				message: 'Passwords do not match.'
			};
			Store[addError](error);
			reject(error);
			return;
		}
		fulfill(fields);
	});
}

function serverSidePreflight (fields) {
	return new Promise((fulfill, reject) => {
		getServer().preflightAccountCreate(fields)
			.then(
				result => { fulfill(result); },
				result => {
					console.debug('Store received preflight result: %O', result);
					Store[clearErrors]();
					if (result.statusCode === 422 || result.statusCode === 409) {
						Store[addError](result);
					}
					reject(result);
				});
	});
}

function preflight (fields) {
	return clientSidePreflight(fields).then(serverSidePreflight);
}

function createAccount (fields) {

	function success (result) {
		Store[accountCreated](result);
	}

	function fail (result) {
		console.log('Account creation fail: %O', result);
		if (Math.floor(result.statusCode / 100) === 4) {
			console.debug(result);
			let res = JSON.parse(result.response);
			Store[addError]({
				field: res.field,
				message: res.message
			});
		}
	}

	return getServer().createAccount(fields)
	.then(success, fail);

}

function preflightCreateAccount (fields) {
	preflight(fields)
		.then(createAccount.bind(null, fields))
		.catch(reason => console.debug(reason));
}

AppDispatcher.register(payload => {
	let action = payload.action;

	switch (action.type) {
	//TODO: remove all switch statements, replace with functional object literals. No new switch statements.

	case Constants.PREFLIGHT:
		preflight(action.fields);
		break;

	case Constants.CREATE_ACCOUNT:
		createAccount(action.fields);
		break;

	case Constants.PREFLIGHT_AND_CREATE_ACCOUNT:
		preflightCreateAccount(action.fields);
		break;

	case Constants.CLEAR_ERRORS:
		Store[clearErrors]();
		break;

	default:
		return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

export default Store;
