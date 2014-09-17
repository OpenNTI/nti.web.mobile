'use strict';

var merge = require('react/lib/merge');

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var Constants = require('./Constants');
var NavRecord = require('./NavRecord');
var invariant = require('react/lib/invariant');

var _nav = {};

var Store = merge(EventEmitter.prototype, {
	displayName: 'navigation.Store',

	getNav: function() {
		return Object.keys(_nav).map(function(k,i,a) {
			return _nav[k];
		});
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

	publishNav: function(key,navRecord) {
		var valid = key && key.trim().length > 0 && navRecord instanceof NavRecord;
		var warning = 'The publish nav action must include a non-empty key string and a NavRecord instance';
		if(!valid) {
			console.warn(warning,key,navRecord);
		}
		invariant(valid,warning);
		_nav[key] = navRecord;
		Store.emitChange({
			nav:this.getNav()
		});
	}

});

module.exports = Store;
