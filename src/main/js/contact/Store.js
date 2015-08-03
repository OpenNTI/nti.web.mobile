import AppDispatcher from 'dispatcher/AppDispatcher';
import Constants from './Constants';
import {CHANGE_EVENT} from 'common/constants/Events';
import {EventEmitter} from 'events';

class Store extends EventEmitter {

	emitChange (event) {
		this.emit(CHANGE_EVENT, event);
	}

}

export default new Store();

function sendMessage () {
	console.debug('faking a message send success');
	return Promise.resolve('not implemented');
}

AppDispatcher.register(payload => {
	let {action} = payload;
	switch(action.type) {
	//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
	case Constants.SEND_MESSAGE:
		sendMessage(payload).then(result => Store.emit({ type: Constants.MESSAGE_SENT, result}));
		break;
	default:
		return true;
	}
	Store.emitChange();
	return true;
});
