'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var Constants = require('./Constants');
var CHANGE_EVENT = require('common/constants').CHANGE_EVENT;
var EventEmitter = require('events').EventEmitter;

var Store = Object.assign({}, EventEmitter.prototype, {

	emitChange: function(event) {
		this.emit(CHANGE_EVENT, event);
	}

});

module.exports = Store;

function sendMessage() {
	console.debug('faking a message send success');
	return Promise.resolve('not implemented');
}

AppDispatcher.register(function(payload) {
    debugger;
    var action = payload.action;
    switch(action.type) {
        case Constants.SEND_MESSAGE:
            sendMessage(payload).then(function(result) {
            	Store.emit({
            		type: Constants.MESSAGE_SENT,
            		result: result
            	});
            });
            break;
        default:
            return true;
    }
    Store.emitChange();
    return true;
});
