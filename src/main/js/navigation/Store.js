'use strict';

var merge = require('react/lib/merge');

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var Constants = require('./Constants');

var _nav = [];

function _publishNav(action) {
	_nav.push(action.nav);
	Store.emitChange({
		nav:_nav.slice()
	});
}

var Store = merge(EventEmitter.prototype, {
	displayName: 'navigation.Store',

	getNav: function() {
		return _nav.slice();
	},

	emitChange: function(evt) {
		console.log(this.displayName + ': emitting change');
		this.emit(Constants.CHANGE_EVENT,evt);
	},

	/**
	* @param {function} callback
	*/
	addChangeListener: function(callback) {
		console.log(this.displayName + ': adding change listener');
		this.on(Constants.CHANGE_EVENT, callback);
	},

	/**
	* @param {function} callback
	*/
	removeChangeListener: function(callback) {
		this.removeListener(Constants.CHANGE_EVENT, callback);
	}

});

AppDispatcher.register(function(payload) {
	var action = payload.action;
	console.log('navigation.Store received %s action.', action.actionType);
	switch(action.actionType) {
		case Constants.PUBLISH_NAV:
			_publishNav(action);
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

module.exports = Store;
