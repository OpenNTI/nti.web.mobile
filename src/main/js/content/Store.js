'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var Constants = require('./Constants');

var CHANGE_EVENT = 'change';

var _data = {};

var Store = merge(EventEmitter.prototype, {
	displayName: 'content.Store',

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


	getPageData: function (id) {
		return _data[id];
	}
});


function persistData(packet) {
	packet.__added = new Date();
	_data[packet.ntiid] = packet;
}


Store.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.actionType) {
        case Constants.PAGE_LOADED:
            persistData(action.response);
            break;
        default:
            return true;
    }
    Store.emitChange(payload.ntiid);
    return true;
});


module.exports = Store;
