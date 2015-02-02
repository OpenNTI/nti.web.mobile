'use strict';



var EventEmitter = require('events').EventEmitter;

var Constants = require('./Constants');
var invariant = require('react/lib/invariant');
var OrderedMap = require('common/collections').OrderedMap;

var _nav = new OrderedMap();
var _isLoading = false;

var Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'navigation.Store',

	getNav: function() {
		return _nav.values();
	},

	isLoading: function() {
		return _isLoading;
	},

	emitChange: function(evt) {
		this.emit(Constants.CHANGE_EVENT,evt);
	},

	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		this.on(Constants.CHANGE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeChangeListener: function(callback) {
		this.removeListener(Constants.CHANGE_EVENT, callback);
	},

	unpublishNav: function(key) {
		_nav.remove(key);
		Store.emitChange({
			nav:this.getNav(),
			isLoading: this.isLoading()
		});
	},

	publishNav: function(key, nav) {
		var valid = key && key.trim().length > 0 && !! nav;
		var warning = 'The publish nav action must include a non-empty key string and a outline';
		if(!valid) {
			console.warn(warning,key, nav);
		}
		invariant(valid,warning);

		_nav.set(key, nav);
		this.setLoading(false);

		Store.emitChange({
			nav:this.getNav(),
			isLoading: this.isLoading()
		});
	},

	setLoading: function(val) {
		if(val !== _isLoading) {
			_isLoading = val;
			this.emitChange({
				isLoading: this.isLoading()
			});
		}
	}

});

module.exports = Store;
