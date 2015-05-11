import AppDispatcher from 'dispatcher/AppDispatcher';
import TypedEventEmitter from './TypedEventEmitter';

const RegisteredCallbackID = Symbol('Registered Dispatcher Callback ID');
const Handlers = Symbol('Handler Map');
const GetHandler = Symbol('GetHandler protected method');

export default class StorePrototype extends TypedEventEmitter {

	constructor () {
		super();
		this[RegisteredCallbackID] = AppDispatcher.register(this.handleDispatch.bind(this));
	}


	/**
	 * @param {object} handlers - a dictionary of actionTypes to
	 *                          functions or property-keys to handle
	 *                          the action.
	 *
	 * @returns {void}
	 */
	registerHandlers (handlers) {
		//TODO: merge, if a key exists, chain the handler call. Test the
		//	return value of the original, if its ===false, return false
		//	without calling the chained method.
		this[Handlers] = handlers;
	}


	[GetHandler] (type) {
		let handler;
		let handlerKey = (this[Handlers] || {})[type];
		if (handlerKey) {
			if (typeof handlerKey !== 'function') {
				handler = this[handlerKey];
				if (!handler || typeof handler !== 'function') {
					console.warn('The key (%s) registered to handle dispatched events of type %s does not point to a function: %s', handlerKey, type);
				}
			} else {
				handler = handlerKey;
			}
		}
		return handler;
	}


	handleDispatch (payload) {
		let {action} = payload;
		if (!action) {
			console.error('Dispatched payload does not have an action. %o', payload);
			return;
		}

		let {type} = action;
		if (!type) {
			console.error('Dispatched action does not have a type: %o', payload);
			return;
		}

		let method = this[GetHandler](type);
		if (method) {
			method.call(this, payload);
		}
	}

}
