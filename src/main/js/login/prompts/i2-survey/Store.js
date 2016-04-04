import {EventEmitter} from 'events';

const CHANGE_EVENT = 'change';

class Store extends EventEmitter {
	constructor (...args) {
		super(...args);
		this.fieldValues = {};
	}

	addChangeListener (callback) {
		this.on(CHANGE_EVENT, callback);
	}

	removeChangeListener (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

	setValue (name, value) {
		this.fieldValues[name] = value;
		this.emitChange({field: name, type: CHANGE_EVENT});
	}

	getValue (name) {
		return this.fieldValues[name];
	}

	emitChange (evt) {
		this.emit(CHANGE_EVENT, evt);
	}
}

export default new Store();
