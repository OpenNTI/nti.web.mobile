import AppDispatcher from 'dispatcher/AppDispatcher';
import * as Constants from './Constants';

function dispatch(type, payload) {
	AppDispatcher.handleRequestAction({type, payload});
}


//FIXME: This is not how to do "Actions".  Actions should DO the work and dispatch results.

export function verifyBillingInfo (stripePublicKey, formData) {
	dispatch(Constants.VERIFY_BILLING_INFO, { stripePublicKey, formData });
}


export function submitPayment (formData) {
	dispatch(Constants.SUBMIT_STRIPE_PAYMENT, {formData});
}

//XXX: Doesn't seem to be referenced.
export function giftPurchaseDone () {
	dispatch(Constants.GIFT_PURCHASE_DONE);
}


export function updateCoupon (purchasable, coupon) {
	dispatch(Constants.UPDATE_COUPON, {purchasable, coupon});
}


export function resetProcess (options) {
	dispatch(Constants.RESET, { options: options });
}


export function edit (mode) {
	dispatch(Constants.EDIT, {mode});
}
