import AppDispatcher from 'dispatcher/AppDispatcher';
import {
	EDIT,
	RESET,
	UPDATE_COUPON,
	SUBMIT_STRIPE_PAYMENT,
	VERIFY_BILLING_INFO
} from './Constants';

const dispatch = (type, payload) => AppDispatcher.handleRequestAction({type, payload});



export function verifyBillingInfo (stripePublicKey, formData) {
	dispatch(VERIFY_BILLING_INFO, { stripePublicKey, formData });
}


export function submitPayment (formData) {
	dispatch(SUBMIT_STRIPE_PAYMENT, {formData});
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
