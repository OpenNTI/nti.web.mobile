'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var Utils = require('common/Utils');
var getServer = Utils.getServer;

var Constants = require('./Constants');
var Actions = Constants.actions;

var CHANGE_EVENT = 'change';
var ERROR_EVENT = 'error';

var _fieldConfig = Object.freeze([
	{
		ref: 'fname',
		type: 'text',
		required: true
	},
	{
		ref: 'lname',
		type: 'text',
		required: true
	},
	{
		ref: 'email',
		type: 'email',
		required: true
	},
	{
		ref: 'Username',
		type: 'text',
		required: true
	},
	{
		ref: 'password',
		type: 'password',
		required: true
	},
	{
		ref: 'password2',
		type: 'password',
		required: true
	}
]);

var _errors = [];

var Store = Object.assign({}, EventEmitter.prototype, {

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
		return Promise.resolve( Utils.getBasePath() + 'api/user-agreement/');
	},

	getUserAgreement: function() {
		return this.getUserAgreementUrl().then(function(url) {
			return getServer()._get(url)
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
		return Promise.resolve({
			fields: _fieldConfig
		});
	}
});

function fieldsMatch(value1, value2) {
	if( !value1 && !value2) {
		return true;
	}
	return value1 === value2;
}

function _preflight(fields) {

	function preflightResult(result) {
		console.debug('Store received preflight result: %O',result);
		Store._clearErrors();
		if (result.statusCode === 422 || result.statusCode === 409) {
			var res = JSON.parse(result.response);
			Store._addError({
				field: res.field,
				message: res.message
			});
		}
		if (!fieldsMatch(fields.password, fields.password2)) {
			Store._addError({
				field: 'password2',
				message: 'Passwords do not match.'
			});
		}
	}

	getServer().preflightAccountCreate(fields)
		.then(preflightResult,preflightResult);
}

function _createAccount(fields) {

	function success(result) {
		Store._accountCreated(result);
	}

	function fail(result) {
		console.log('Account creation fail: %O',result);
		if (result.statusCode === 422) {
			console.debug(result);
			var res = JSON.parse(result.response);
			Store._addError({
				field: res.field,
				message: res.message
			});
		}
	}

	getServer().createAccount(fields)
	.then(success, fail);

}

AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch (action.type) {

		case Actions.PREFLIGHT:
			_preflight(action.fields);
		break;

		case Actions.CREATE_ACCOUNT:
			_createAccount(action.fields);
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = Store;
