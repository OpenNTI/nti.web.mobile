'use strict';

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('./LibraryConstants');
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var _data = {};

var LibraryStore = merge(EventEmitter.prototype, {

	emitChange: function(evt) {
		console.log('LibraryStore: emitting change event');
		this.emit(CHANGE_EVENT, evt);
	},

	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		console.log('LibraryStore: adding change listener');
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


function persistData(libraryCollection) {
	_data = libraryCollection;
}


LibraryStore.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.actionType) {
        case Constants.LOADED_LIBRARY:
            persistData(action.response);
            break;
        default:
            return true;
    }
    LibraryStore.emitChange();
    return true;
});


module.exports = LibraryStore;
