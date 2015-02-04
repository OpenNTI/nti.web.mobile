import {EventEmitter} from 'events';
import {CHANGE_EVENT} from './constants/Events';

/**
 * We frequently emit events with a type field specified via a constant.
 * Occasionally the constant is not defined or misspelled, resulting in
 * an event with an undefined type.
 *
 * This emitChange implementation checks for a type before emitting, throws
 * an error if it's undefined.
 */

export default class TypedEventEmitter extends EventEmitter {

	constructor () {
		super();
	}


	emitChange (data) {
		if (data && !data.type) {
			throw new Error('Change Events must have data and a type.', data);
		}
		this.emit(CHANGE_EVENT, data);
	}


	addChangeListener (callback) {
		this.on(CHANGE_EVENT, callback);
	}


	removeChangeListener (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}



	/**
	 * emitChange with an {isError: true} in the event.
	 */
	emitError (error) {
		this.emitChange(Object.assign(error,{isError: true}));
	}
}
