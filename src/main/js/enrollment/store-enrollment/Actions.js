import AppDispatcher from 'dispatcher/AppDispatcher';
import * as Constants from './Constants';

function dispatch(type, payload) {
	AppDispatcher.handleRequestAction({type, payload});
}


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


export function redeemGift (purchasable, courseId, accessKey) {
	dispatch(Constants.REDEEM_GIFT, { purchasable, courseId, accessKey });
}


export function edit (mode) {
	dispatch(Constants.EDIT, {mode});
}
