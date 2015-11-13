import AppDispatcher from 'dispatcher/AppDispatcher';
import {EventEmitter} from 'events';

import * as Api from './Api';
import * as Constants from './Constants';
import {CHANGE_EVENT} from 'common/constants/Events';


let stripeToken; // store the result of a Stripe.getToken() call
let pricing;
let giftInfo;
let paymentFormData = {}; // store cc info so we can repopulate the form if the user navigates back from the confirmation view.
let paymentResult;
let couponTimeout;
let couponPricing;


let Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'store-enrollment.Store',

	emitChange (evt) {
		this.emit(CHANGE_EVENT, evt);
	},

	emitError (event) {
		this.emitChange(Object.assign({ isError: true}, event));
	},


	addChangeListener (callback) {
		this.on(CHANGE_EVENT, callback);
	},


	removeChangeListener (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	priceItem (purchasable) {
		return Api.getPricing(purchasable)
			.then(pricedItem => {
				Store.emitChange({
					type: Constants.PRICED_ITEM_RECEIVED,
					pricedItem: pricedItem
				});
				return pricedItem;
			});
	},

	getStripeToken () {
		if(!stripeToken) {
			throw new Error('Store doesn\'t currently have a stripe token. (Did you get a BILLING_INFO_VERIFIED event after a call to Actions.verifyBillingInfo?)');
		}
		return Object.assign({}, stripeToken);
	},

	getPricing () {
		return pricing;
	},

	getGiftInfo () {
		return giftInfo;
	},

	getCouponPricing () {
		return couponPricing;
	},

	getPaymentFormData () {
		let data = Object.assign({}, paymentFormData);

		// don't repopulate credit card number
		delete data.number;
		// don't repopulate cvc
		delete data.cvc;

		return data;
	},

	getPaymentResult () {
		return paymentResult;
	},


	clear () {
		stripeToken = null;
		pricing = null;
		giftInfo = null;
		paymentFormData = null;
		paymentResult = null;
		couponTimeout = null;
		couponPricing = null;
	}
});

export default Store;



function pullData (data) {
	let result = {};

	let copy = x => {
		if (data.hasOwnProperty(x)) {
			result[x] = data[x];
		}
	};

	let pull = x => {
		copy(x);
		delete data[x];
	};

	pricing = {
		coupon: data.coupon,
		expected_price: data.expected_price // eslint-disable-line camelcase
	};

	copy('from');
	pull('to');
	pull('toFirstName');
	pull('toLastName');
	pull('receiver');
	pull('message');
	pull('sender');

	giftInfo = data.from && Object.keys(result).length ? result : null;
}

function verifyBillingInfo (data) {

	stripeToken = null; // reset
	pricing = null;
	giftInfo = null;
	paymentFormData = data.formData;

	return Api.getToken(data.stripePublicKey, data.formData)
		.then(result => {
			let eventType = result.status === 200 ?
				Constants.BILLING_INFO_VERIFIED :
				Constants.BILLING_INFO_REJECTED;

			stripeToken = result.response;

			pullData(paymentFormData);

			Store.emitChange({
				type: eventType,
				status: result.status,
				response: result.response
			});
		})
		.catch(reason => {
			//FIXME: Are we intending that the verifyBillingInfo promise never reject??
			//If not, this catch needs to return a rejected promise.
			console.error('verifyBillingInfo failed. %O', reason);
		});
}

function submitPayment (formData) {
	paymentResult = null;

	return Api.submitPayment(formData)
		.then(result => {
			let type = (result || {}).state === 'Success' ?
				Constants.STRIPE_PAYMENT_SUCCESS :
				Constants.STRIPE_PAYMENT_FAILURE;

			// if (type === Constants.STRIPE_PAYMENT_SUCCESS) {
			// 	Store.clear();
			// }

			paymentResult = result;

			Store.emitChange({
				type: type,
				purchaseAttempt: result
			});
		},
		reason => Store.emitError({ type: Constants.POLLING_ERROR, reason }));
}

function priceWithCoupon (data) {
	if (!couponTimeout) {
		Store.emitChange({
			type: Constants.LOCK_SUBMIT
		});
	}

	clearTimeout(couponTimeout);

	couponTimeout = setTimeout(() => {
		couponPricing = null;

		return Api.getCouponPricing(data.purchasable, data.coupon)
			.then(result => {
				couponPricing = result;

				Store.emitChange({
					type: Constants.VALID_COUPON,
					pricing: result,
					coupon: data.coupon
				});

				Store.emitChange({
					type: Constants.UNLOCK_SUBMIT
				});
			})
			.catch((/*reason*/) => {
				Store.emitChange({
					type: Constants.INVALID_COUPON,
					coupon: data.coupon
				});

				Store.emitChange({
					type: Constants.UNLOCK_SUBMIT
				});
			});
	}, 2000);
}


Store.appDispatch = AppDispatcher.register(function (data) {
	let action = data.action;

	switch(action.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
	case Constants.EDIT:
		Store.emitChange({
			type: action.type,
			mode: action.payload.mode
		});
		break;

	case Constants.RESET:
		Store.clear();
		Store.emitChange({
			type: action.type,
			options: (action.payload || {}).options
		});
		break;

	case Constants.UPDATE_COUPON:
		priceWithCoupon(action.payload);
		break;

	case Constants.VERIFY_BILLING_INFO:
		verifyBillingInfo(action.payload);
		break;

	case Constants.SUBMIT_STRIPE_PAYMENT:
		submitPayment(action.payload.formData);
		break;

	default:
		return true;
	}
	return true;
});
