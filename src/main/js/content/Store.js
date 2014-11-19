'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;


var Constants = require('./Constants');

var CHANGE_EVENT = require('common/constants').CHANGE_EVENT;

var _pages = {};

var Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'content.Store',

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


	getPageDescriptor: function (id) {
		return _pages[id];
	}
});


function persistPage(descriptor) {
	_pages[descriptor.getID()] = descriptor;
}


Store.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
        case Constants.PAGE_LOADED:
            persistPage(action.response);
            break;
        default:
            return true;
    }
    Store.emitChange(payload.ntiid);
    return true;
});


module.exports = Store;
