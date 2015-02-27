import AppDispatcher from 'dispatcher/AppDispatcher';

import {getLibrary} from './Api';
import {LOADED_LIBRARY} from './Constants';

var willLoad;


export function load (reload) {
	let result = willLoad;
	if (!result || reload) {
		//This should only fire for actual loads and not cached (previously-resolved) promises.
		willLoad = result = getLibrary(reload)
			.then(library => dispatch(LOADED_LIBRARY, library));
	}

	return result;
}


export function reload () {
	return load(true);
}


function dispatch(type, response) {
	AppDispatcher.handleRequestAction({ type, response });
	return response;
}
