'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;


var Constants = require('./Constants');

var CHANGE_EVENT = require('common/constants').CHANGE_EVENT;

var _data = {};

var Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'course.Store',

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
	if (data && data instanceof Error) {
		_data = {error: data, notFound: data.message === Constants.NOT_FOUND};
		return;
	}

	_data = data;
}


Store.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
    //TODO: remove all switch statements, replace with functional object literals. No new switch statements.
        case Constants.SET_ACTIVE_COURSE:
            persistData(action.response);
            break;
        default:
            return true;
    }
    Store.emitChange();
    return true;
});


module.exports = Store;
