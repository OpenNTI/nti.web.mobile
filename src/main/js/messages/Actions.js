


import {EventEmitter} from 'events';

import AppDispatcher from 'dispatcher/AppDispatcher';
import {IllegalArgumentException} from 'common/exceptions';

let Actions = require('./Constants').actions;
import Store from './Store';
import Message from './Message';


/**
 * Actions available to views for alerts/messages related functionality.
 **/
module.exports = Object.assign({}, EventEmitter.prototype, {

	addMessage: function(message) {
		if (!(message instanceof Message)) {
			let e = new IllegalArgumentException('message must be an instance of Message');
			console.error(e);
			throw e;
		}
		AppDispatcher.handleViewAction({
			type: Actions.MESSAGES_ADD,
			message: message
		});
	},

	clearMessages: function(options) {
		Store.clearMessages(options && options.category);
	},

	removeMessage: function(id) {
		AppDispatcher.handleViewAction({
			type: Actions.MESSAGES_REMOVE,
			messageId: id
		});
	}

});
