import AppDispatcher from 'dispatcher/AppDispatcher';

import {LOAD_CATALOG, LOADED_CATALOG, GIFT_CODE_REDEEMED, REDEEM_GIFT, INVALID_GIFT_CODE} from './Constants';

import StorePrototype from 'common/StorePrototype';
import {getService} from 'common/utils';

const data = Symbol('data');
const SetLoading = Symbol('set:loading');
const SetData = Symbol('set:data');

class Store extends StorePrototype {

	constructor () {
		super();
		this.registerHandlers({
			[LOAD_CATALOG]: SetLoading,
			[LOADED_CATALOG]: SetData
		});
	}


	get isLoaded () {
		return !!this[data];
	}


	[SetLoading] () {
		this.loading = true;
		this.emitChange({type: LOAD_CATALOG});
	}


	[SetData] (payload) {
		let d = this[data] = payload.action.response;
		d.applied = new Date();
		this.loading = false;
		this.emitChange({type: LOADED_CATALOG});
	}


	getData () { return this[data]; }


	getEntry (id) {
		let d = this[data];
		let entry = {loading: true};
		if (d && d.findEntry) {
			entry = d.findEntry(id);
		}

		return entry;
	}


	setActivePageSource (ps) {
		this.pageSource = ps;
	}


	getPageSource () {
		return this.pageSource;
	}
}

function getEnrollmentService () {
	return getService().then(function (service) {
		return service.getEnrollment();
	});
}

function redeemGift (purchasable, courseId, accessKey) {
	return getEnrollmentService().then(service =>
		service.redeemGift(purchasable, courseId, accessKey));
}

let store = new Store();


Store.appDispatch = AppDispatcher.register(function (event) {
	let action = event.action;

	if(action.type === REDEEM_GIFT) {
		redeemGift(
			action.payload.purchasable,
			action.payload.courseId,
			action.payload.accessKey)

		.then(
			result => store.emitChange({ type: GIFT_CODE_REDEEMED, action, result }),

			reason => {

				let message = reason.Message;

				store.emitError({
					type: INVALID_GIFT_CODE,
					action: action,
					reason: message
				});
			});
	}
	return true;
});

export default store;
