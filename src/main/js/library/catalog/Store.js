'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;


var Constants = require('./Constants');

var CHANGE_EVENT = 'change';

var _data = {};

var Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'catalog.Store',

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
	},


	getEntry: function(id) {
		var entry = {loading: true};
		if (_data.findEntry) {
			entry = _data.findEntry(id);
		}
		return entry;
	}
});


function persistData(data) {
	_data = data;
	_data.loaded = true;
}


Store.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
    //TODO: remove all switch statements, replace with functional object literals. No new switch statements.
        case Constants.LOADED_CATALOG:
            persistData(action.response);
            break;
        default:
            return true;
    }
    Store.emitChange();
    return true;
});


module.exports = Store;
