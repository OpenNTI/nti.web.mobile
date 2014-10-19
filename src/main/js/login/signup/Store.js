

'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var dataserver = require('common/Utils').getServer;
var Links = require('../Constants').links

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
		ref: 'username',
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

var SignupStore = merge(EventEmitter.prototype, {

	emitChange: function(evt) {
		console.log('SignupStore: emitting change');
		this.emit(CHANGE_EVENT, evt);
	},

	/**
	* @param {function} callback
	*/
	addChangeListener: function(callback) {
		console.log('SignupStore: adding change listener');
		this.on(CHANGE_EVENT, callback);
	},

	/**
	* @param {function} callback
	*/
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	getUserAgreementUrl: function() {
		return Promise.resolve('https://docs.google.com/document/pub?id=1rM40we-bbPNvq8xivEKhkoLE7wmIETmO4kerCYmtISM&embedded=true');
	},

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

	getFormConfig: function() {
		return this._getCreationLinks().then(function(links) {
			return {
				links: links,
				fields: _fieldConfig
			};
		});
	}
});

AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch (action.actionType) {
		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = SignupStore;
