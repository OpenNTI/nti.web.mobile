import AppDispatcher from 'dispatcher/AppDispatcher';

import {getCatalog} from './Api';
import {LOADED_CATALOG} from './Constants';


export function reload () {
	return load(true);
}

export function load (reload) {
    return getCatalog(!!reload)
		.then(catalog =>
			dispatch(LOADED_CATALOG, catalog))
		.catch(e=>{
			console.log('loadCatalog failed. %O', e);
			return Promise.reject(e);
		});
}


function dispatch(type, collection) {
	AppDispatcher.handleRequestAction({ type, response: collection });
}
