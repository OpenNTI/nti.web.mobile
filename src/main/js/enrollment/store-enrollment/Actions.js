import AppDispatcher from '@nti/lib-dispatcher';

import * as Api from './Api';
import * as Constants from './Constants';

const dispatch = (type, payload) =>
	AppDispatcher.handleRequestAction({ type, payload });

export const resetProcess = options => dispatch(Constants.RESET, { options });
export const edit = mode => dispatch(Constants.EDIT, { mode });

export function priceItem(purchasable) {
	return Api.getPricing(purchasable).then(pricedItem => {
		dispatch(Constants.PRICED_ITEM_RECEIVED, { pricedItem });
		return pricedItem;
	});
}

export function verifyBillingInfo(stripePublicKey, formData, createToken) {
	//this modifies formData >.< ...
	function pullData(data) {
		const result = {};

		const copy = x => {
			if (Object.prototype.hasOwnProperty.call(data, x)) {
				result[x] = data[x];
			}
		};

		const pull = x => {
			copy(x);
			delete data[x];
		};

		const { coupon, expected_price } = data;
		const couponInfo = { coupon, expected_price };

		copy('from');
		pull('to');
		pull('toFirstName');
		pull('toLastName');
		pull('receiver');
		pull('message');
		pull('sender');

		const giftInfo =
			data.from && Object.keys(result).length ? result : null;

		return { couponInfo, giftInfo };
	}

	if (!createToken) {
		return;
	}

	createToken(formData)
		.then(stripeToken => {
			const { couponInfo = null, giftInfo = null } = pullData(formData);

			dispatch(Constants.BILLING_INFO_VERIFIED, {
				stripeToken,
				stripePublicKey,
				formData,
				giftInfo,
				couponInfo,
			});
		})

		.catch(result =>
			dispatch(Constants.BILLING_INFO_REJECTED, { formData, result })
		);
}

export function submitPayment(formData) {
	return Api.submitPayment(formData)
		.then(result => {
			const eventType =
				(result || {}).state === 'Success'
					? Constants.STRIPE_PAYMENT_SUCCESS
					: Constants.STRIPE_PAYMENT_FAILURE;

			dispatch(eventType, { purchaseAttempt: result });
		})
		.catch(error => {
			dispatch(Constants.POLLING_ERROR, { purchaseAttempt: error });
		});
}

export function updateCoupon(purchasable, coupon) {
	dispatch(Constants.CHECKING_COUPON);

	clearTimeout(updateCoupon.timeout);

	updateCoupon.timeout = setTimeout(() => {
		return Api.getCouponPricing(purchasable, coupon).then(
			pricing => dispatch(Constants.VALID_COUPON, { pricing, coupon }),
			() => dispatch(Constants.INVALID_COUPON, { coupon })
		);
	}, 2000);
}
