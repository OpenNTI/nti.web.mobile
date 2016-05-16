import StorePrototype from 'nti-lib-store';

import {
	EDIT,
	RESET,

	PRICED_ITEM_RECEIVED,

	LOCK_SUBMIT,
	UNLOCK_SUBMIT,

	CHECKING_COUPON,
	INVALID_COUPON,
	VALID_COUPON,

	STRIPE_PAYMENT_SUCCESS,
	STRIPE_PAYMENT_FAILURE,
	POLLING_ERROR,

	BILLING_INFO_VERIFIED,
	BILLING_INFO_REJECTED
} from './Constants';

const HandleCoupon = Symbol();
const HandleBillingInfo = Symbol();
const HandlePurchase = Symbol();

class Store extends StorePrototype {

	constructor () {
		super();
		this.registerHandlers({

			[EDIT] (data) {
				this.emitChange({ type: EDIT, mode: data.action.payload.mode });
			},

			[RESET] (data) {
				this.clear();
				this.emitChange({
					type: RESET,
					options: (data.action.payload || {}).options
				});
			},

			[PRICED_ITEM_RECEIVED] (data) {
				this.emitChange(
					Object.assign(
						{ type: PRICED_ITEM_RECEIVED },
						data.action.payload));
			},


			[CHECKING_COUPON] () { this.emitChange({type: LOCK_SUBMIT}); },
			[VALID_COUPON]: HandleCoupon,
			[INVALID_COUPON]: HandleCoupon,

			[BILLING_INFO_VERIFIED]: HandleBillingInfo,
			[BILLING_INFO_REJECTED]: HandleBillingInfo,

			[STRIPE_PAYMENT_SUCCESS]: HandlePurchase,
			[STRIPE_PAYMENT_FAILURE]: HandlePurchase,
			[POLLING_ERROR] () {}
		});

		this.clear(); //setup data
	}


	[HandleCoupon] (data) {
		const {payload, type} = data.action;
		const {coupon, pricing = null} = payload;

		Object.assign(this.data, {
			couponPricing: pricing,
			coupon
		});

		this.emitChange({type, coupon, pricing});
		this.emitChange({type: UNLOCK_SUBMIT});
	}


	[HandleBillingInfo] (data) {
		const {payload, type} = data.action;
		const {stripeToken, stripePublicKey, formData, giftInfo, couponInfo} = payload;
		const {status, response} = payload.result || {};

		Object.assign(this.data, {
			stripePublicKey,
			stripeToken,
			formData,
			giftInfo,
			couponInfo
		});

		this.emitChange({type, status, response});
	}


	[HandlePurchase] (data) {
		const {payload, type} = data.action;
		const {purchaseAttempt} = payload;

		Object.assign(this.data, {
			purchaseAttempt
		});

		this.emitChange({type, purchaseAttempt});
	}


	getStripeToken () {
		if(!this.data.stripeToken) {
			throw new Error('Store doesn\'t currently have a stripe token.');
		}
		return Object.assign({}, this.data.stripeToken);
	}


	getCouponInfo () {
		return this.data.couponInfo;
	}


	getCouponPricing () {
		return this.data.couponPricing;
	}


	getGiftInfo () {
		return this.data.giftInfo;
	}


	getPaymentFormData () {
		let data = Object.assign({}, this.data.formData);

		// don't repopulate credit card number
		delete data.number;
		// don't repopulate cvc
		delete data.cvc;

		return data;
	}


	getPaymentResult () {
		return this.data.purchaseAttempt;
	}


	clear () {
		this.data = {};
	}
}

export default new Store();
