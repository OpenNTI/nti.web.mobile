

'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var dataserver = require('common/Utils').getServer;
var Links = require('../Constants').links

var CHANGE_EVENT = 'change';
var ERROR_EVENT = 'error';

var _fieldConfig = {
	links: {},
	fields: [
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
	}]
};

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

	// where to post the form for preflight and account creation.
	_getCreationLinks: function() {
		return dataserver().ping(null, null)
		.then(function(result) {
			debugger;
			return result;
		}, undefined)
		.catch (function(r) {
			console.error(r);
		});
	},

	getFormConfig: function() {
		return this._getCreationLinks().then(function(result) {
			[Links.ACCOUNT_PREFLIGHT_CREATE, Links.ACCOUNT_CREATE].forEach(function(v) {
				_fieldConfig.links[v] = result.links[v];
			})
			return _fieldConfig;
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
