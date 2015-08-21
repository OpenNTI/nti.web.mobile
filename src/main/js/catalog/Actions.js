import AppDispatcher from 'dispatcher/AppDispatcher';
import {getService} from 'common/utils';
import {getCatalog} from './Api';

import {LOAD_CATALOG, LOADED_CATALOG, GIFT_CODE_REDEEMED, INVALID_GIFT_CODE} from './Constants';


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
			.catch(e => {
				console.log('loadCatalog failed. %O', e);
				return Promise.reject(e);
			});
	}

	return load.result;
}


export function redeemGift (purchasable, courseId, accessKey) {
	getService().then(service => service.getEnrollment())
		.then(service => service.redeemGift(purchasable, courseId, accessKey))
		.then(
			result => dispatch(GIFT_CODE_REDEEMED, result),
			reason => dispatch(INVALID_GIFT_CODE, reason.Message));
}

function dispatch (type, collection) {
	AppDispatcher.handleRequestAction({ type, response: collection });
}
