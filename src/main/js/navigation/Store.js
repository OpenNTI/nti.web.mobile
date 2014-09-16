'use strict';

var merge = require('react/lib/merge');

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var Constants = require('./Constants');
var NavRecord = require('./NavRecord');
var invariant = require('react/lib/invariant');

var _nav = [];

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
	},

	publishNav: function(navRecord) {
		debugger;
		invariant(
			navRecord instanceof NavRecord,
			'The publish nav action must include a root NavRecord instance under the nav property'
		);
		_nav.push(navRecord);
		Store.emitChange({
			nav:_nav.slice()
		});
	}

});

module.exports = Store;
