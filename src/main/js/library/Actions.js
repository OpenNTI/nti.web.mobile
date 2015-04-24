import AppDispatcher from 'dispatcher/AppDispatcher';

import {getLibrary} from './Api';
import {LOADED_LIBRARY} from './Constants';

let willLoad;


export function load (forceLoad) {
	let result = willLoad;
	if (!result || forceLoad) {
		//This should only fire for actual loads and not cached (previously-resolved) promises.
		willLoad = result = getLibrary(forceLoad)
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
