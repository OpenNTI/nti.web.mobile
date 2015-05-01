import AppDispatcher from 'dispatcher/AppDispatcher';
import {IllegalArgumentException} from 'common/exceptions';

import {actions} from './Constants';
import Store from './Store';
import Message from './Message';


export function addMessage (message) {
	if (!(message instanceof Message)) {
		let e = new IllegalArgumentException('message must be an instance of Message');
		console.error(e);
		throw e;
	}

	AppDispatcher.handleViewAction({
		type: actions.MESSAGES_ADD,
		message
	});
}


export function clearMessages (options) {
	Store.clearMessages(options && options.category);
}


export function removeMessage (id) {
	AppDispatcher.handleViewAction({
		type: actions.MESSAGES_REMOVE,
		messageId: id
	});
}
