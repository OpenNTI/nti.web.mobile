'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var Constants = require('./Constants');

var CHANGE_EVENT = 'change';

var _data = {};

var Store = merge(EventEmitter.prototype, {
	displayName: 'notifications.Store',

	emitChange: function(evt) {
		this.emit(CHANGE_EVENT, evt);
	},

	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	getData: function() {
		return _data;
	}
});


function persistData(data) {
	_data = data;
	data.loaded = true;//stop notifications from reloading...
}


Store.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
        case Constants.LOADED_NOTIFICATIONS:
            persistData(action.response);
            break;
        default:
            return true;
    }
    Store.emitChange();
    return true;
});


module.exports = Store;
