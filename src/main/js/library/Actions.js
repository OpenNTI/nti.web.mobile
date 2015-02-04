import AppDispatcher from 'dispatcher/AppDispatcher';

import {getLibrary} from './Api';
import {LOADED_LIBRARY} from './Constants';

var willLoad;


export function load (reload) {

	var result = getLibrary(reload);

	if (!willLoad || reload) {
		//This should only fire for actual loads and not cached (previously-resolved) promises.
		result = willLoad = result
			.then(library => dispatch(LOADED_LIBRARY, library));
	}

	return result;
}


export function reload () {
	return load(true);
}


function dispatch(type, collection) {
	AppDispatcher.handleRequestAction({ type, response: collection });
}
