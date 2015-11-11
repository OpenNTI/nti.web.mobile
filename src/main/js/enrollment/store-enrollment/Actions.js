import AppDispatcher from 'dispatcher/AppDispatcher';
import {
	EDIT,
	RESET,
	UPDATE_COUPON,
	GIFT_PURCHASE_DONE,
	SUBMIT_STRIPE_PAYMENT,
	VERIFY_BILLING_INFO
} from './Constants';


function dispatch (type, payload) {
	AppDispatcher.handleRequestAction({type, payload});
}


//FIXME: This is not how to do "Actions".  Actions should DO the work and dispatch results.

export function verifyBillingInfo (stripePublicKey, formData) {
	dispatch(VERIFY_BILLING_INFO, { stripePublicKey, formData });
}


export function submitPayment (formData) {
	dispatch(SUBMIT_STRIPE_PAYMENT, {formData});
}


//XXX: Doesn't seem to be referenced.
export function giftPurchaseDone () {
	console.error('Called??');
	dispatch(GIFT_PURCHASE_DONE);
}


export function updateCoupon (purchasable, coupon) {
	dispatch(UPDATE_COUPON, {purchasable, coupon});
}


export function resetProcess (options) {
	dispatch(RESET, { options });
}


export function edit (mode) {
	dispatch(EDIT, {mode});
}
