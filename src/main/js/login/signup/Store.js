

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

	getUserAgreementUrl: function() {
		return Promise.resolve('https://docs.google.com/document/pub?id=1rM40we-bbPNvq8xivEKhkoLE7wmIETmO4kerCYmtISM&embedded=true');
	},

	// FIXME: don't need this. the preflight url is handled by the dataserver interface;
	// where to post the form for preflight and account creation.
	_getCreationLinks: function() {
		return dataserver().ping(null, null)
			.then(function(result) {
				var r = {};
				r[Links.ACCOUNT_PREFLIGHT_CREATE] = result.links[Links.ACCOUNT_PREFLIGHT_CREATE];
				r[Links.ACCOUNT_CREATE] = result.links[Links.ACCOUNT_CREATE];
				return r;
			}, undefined)
			.catch (function(result) {
				console.error(result);
			}
		);
	},

	// FIXME: don't need _getCreationLinks. let the the dataserver interface worry about the urls;
	getFormConfig: function() {
		return this._getCreationLinks().then(function(links) {
			return {
				links: links,
				fields: _fieldConfig
			};
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
	console.warn('create acocunt not implemented. %O', fields);

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
