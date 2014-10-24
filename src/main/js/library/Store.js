'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var Actions = require('./Actions');
var Constants = require('./Constants');

var CHANGE_EVENT = 'change';

var _data = {};

var Store = merge(EventEmitter.prototype, {
	displayName: 'library.Store',

	emitChange: function(evt) {
		console.log(this.displayName + ': emitting change event');
		this.emit(CHANGE_EVENT, evt);
	},

	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		console.log(this.displayName + ': adding change listener');
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
	_data.loaded = true;
}


Store.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.actionType) {
        case Constants.LOADED_LIBRARY:
            persistData(action.response);
            break;
        default:
            return true;
    }
    Store.emitChange();
    return true;
});


module.exports = Store;
