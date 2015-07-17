import AppDispatcher from 'dispatcher/AppDispatcher';
import {EventEmitter} from 'events';

import Message from './Message';
import * as Constants from './Constants';

let Actions = Constants.actions;
let Events = Constants.events;


let messages = {};


let Store = Object.assign({}, EventEmitter.prototype, {

	emitChange () {
		this.emit(Events.MESSAGES_CHANGE, this.messages());
	},


	addChangeListener (callback) {
		this.on(Events.MESSAGES_CHANGE, callback);
	},


	removeChangeListener (callback) {
		this.removeListener(Events.MESSAGES_CHANGE, callback);
	},

	messages (options) {
		let result = Object.keys(messages).map(key => messages[key]);
		if(options && options.category) {
			result = result.filter(v => v.category === options.category);
		}
		return result;
	},

	clearMessages (category) {
		if (Object.keys(messages).length === 0) {
			return;
		}
		if(category) {
			Object.keys(messages).forEach(key => {
				let m = messages[key];
				if(m.category === category) {
					delete messages[key];
				}
			});
		}
		else {
			messages = {};
		}
		this.emitChange();
	}

});

/**
 * Add a message
 * @param {object} message object
 * @return {void}
 */
function addMessage(message) {
	if (!(message instanceof Message)) {
		throw new Error('message must be an instance of Message.');
	}
	messages[message.id] = message;
	Store.emitChange();
}

function removeMessage(id) {
	delete messages[id];
	Store.emitChange();
}


AppDispatcher.register(payload => {
	let action = payload.action;
	switch (action.type) {
	//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
		case Actions.MESSAGES_ADD:
			addMessage(action.message);
		break;

		case Actions.MESSAGES_CLEAR:
			Store.clearMessages(action.category);
		break;

		case Actions.MESSAGES_REMOVE:
			removeMessage(action.messageId);
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

export default Store;
