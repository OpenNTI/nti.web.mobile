import AppDispatcher from 'dispatcher/AppDispatcher';

import {getCatalog} from './Api';
import {LOAD_CATALOG, LOADED_CATALOG, REDEEM_GIFT} from './Constants';


export function reload () {
	return load(true);
}

export function load (force = false) {

	let result = getCatalog(!!force);
	if (result !== load.last) {
		dispatch(LOAD_CATALOG);
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

export function redeemGift (purchasable, courseId, accessKey) {
	AppDispatcher.handleRequestAction( {type: REDEEM_GIFT, payload: { purchasable, courseId, accessKey }});
}

function dispatch(type, collection) {
	AppDispatcher.handleRequestAction({ type, response: collection });
}
