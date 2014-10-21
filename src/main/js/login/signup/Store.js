

'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var dataserver = require('common/Utils').getServer;
var Constants = require('./Constants');
var Actions = Constants.actions;
var Links = require('../Constants').links; // note: using login constants here, not signup.

var CHANGE_EVENT = 'change';
var ERROR_EVENT = 'error';

var _fieldConfig = Object.freeze([
	{
		ref: 'fname',
		type: 'text'
	}, 
	{
		ref: 'lname',
		type: 'text'
	}, 
	{
		ref: 'email',
		type: 'email'
	}, 
	{
		ref: 'Username',
		type: 'text'
	}, 
	{
		ref: 'password',
		type: 'password'
	}, 
	{
		ref: 'password2',
		type: 'password'
	}
]);

var _errors = [];

var Store = merge(EventEmitter.prototype, {

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
			})
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
		return Promise.resolve( $AppConfig.basepath + 'api/user-agreement/');
	},

	getUserAgreement: function() {
		return this.getUserAgreementUrl().then(function(url) {
			return $.get(url);
		});
		// Promise.resolve('https://docs.google.com/document/pub?id=1rM40we-bbPNvq8xivEKhkoLE7wmIETmO4kerCYmtISM&embedded=true');
	},

	getFormConfig: function() {
		return Promise.resolve({
			fields: _fieldConfig
		});
	}
});

function _preflight(fields) {

	function preflightResult(result) {
		console.debug('Store received preflight result: %O',result);
		Store._clearErrors();
		if (result.statusCode === 422) {
			var res = JSON.parse(result.response)
			Store._addError({
				field: res.field,
				message: res.message
			});
		}
	}

	dataserver().preflightAccountCreate(fields)
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
			var res = JSON.parse(result.response)
			Store._addError({
				field: res.field,
				message: res.message
			});
		}
	}

	dataserver().createAccount(fields)
	.then(success, fail);

}

AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch (action.actionType) {

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
