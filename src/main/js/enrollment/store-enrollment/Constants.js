const getConst = x => Symbol(x);
//const getConst = x => `store-enrollment:${x}`;

export const EDIT = getConst('edit');
export const RESET = getConst('reset');

export const LOCK_SUBMIT = getConst('submit:Lock');
export const UNLOCK_SUBMIT = getConst('submit:Unlock');

export const CHECKING_COUPON = getConst('coupon:Checking');
export const VALID_COUPON = getConst('coupon:Valid');
export const INVALID_COUPON = getConst('coupon:Invalid');

export const PRICE_ITEM_ACTION = getConst('priced item:Action');
export const PRICED_ITEM_RECEIVED = getConst('priced item:Received');
export const PRICED_ITEM_ERROR = getConst('priced item:Error');

export const BILLING_INFO_VERIFIED = getConst('billing:info:Verified');
export const BILLING_INFO_REJECTED = getConst('billing:info:Rejected');

export const STRIPE_PAYMENT_SUCCESS = getConst('stripe:payment:Success');
export const STRIPE_PAYMENT_FAILURE = getConst('stripe:payment:Failure');
export const POLLING_ERROR = getConst('Polling Error');
