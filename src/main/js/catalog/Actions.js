import AppDispatcher from 'dispatcher/AppDispatcher';

import {getCatalog} from './Api';
import {LOADED_CATALOG} from './Constants';


export function reload () {
	return load(true);
}

export function load (reload) {

	let result = getCatalog(!!reload);
	if (result !== load.last) {
		load.last = result;
		load.result = result
			.then(catalog =>
				dispatch(LOADED_CATALOG, catalog))
			.catch(e=>{
				console.log('loadCatalog failed. %O', e);
				return Promise.reject(e);
			});
	}

	return load.result;
}


function dispatch(type, collection) {
	AppDispatcher.handleRequestAction({ type, response: collection });
}
