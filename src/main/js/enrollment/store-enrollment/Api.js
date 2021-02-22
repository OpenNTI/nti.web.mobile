/*global Stripe*/
import { getService } from '@nti/web-client';

const POLL_INTERVAL = 1000;

const get = (...args) => getService().then(s => s.get(...args));
const post = (...args) => getService().then(s => s.post(...args));
const parse = o => getService().then(s => s.getObject(o));

export function getPricing(purchasable) {
	const link = purchasable.getLink('price');

	if (!link) {
		throw new Error('Unable to find price link for provided Purchasable');
	}

	return post(link, { purchasableID: purchasable.ID }).then(o => parse(o));
}

export function getCouponPricing(purchasable, coupon) {
	const link = purchasable.getLink('price_purchasable_with_stripe_coupon');
	const data = { purchasableID: purchasable.ID };

	if (coupon) {
		data.Coupon = coupon;
	}

	if (!link) {
		throw new Error(
			'Unable to find price with coupon link for purchasable'
		);
	}

	return post(link, data).then(o => parse(o));
}

export function getToken(stripePublicKey, data) {
	return new Promise((fulfill, reject) => {
		Stripe.setPublishableKey(stripePublicKey);
		Stripe.card.createToken(data, (status, response) => {
			if (response.error) {
				reject({ status, response });
			} else {
				fulfill({ status, response });
			}
		});
	});
}

export function submitPayment(data) {
	let { stripeToken, purchasable, couponInfo, giftInfo } = data;

	let linkRel = giftInfo ? 'gift_stripe_payment' : 'post_stripe_payment';
	let pollUrl = giftInfo
		? '/dataserver2/store/get_gift_purchase_attempt'
		: '/dataserver2/store/get_purchase_attempt';
	let paymentUrl = purchasable.getLink(linkRel);
	let payload = {
		purchasableID: purchasable.ID,
		token: stripeToken.id,
		context: {
			AllowVendorUpdates: data.allowVendorUpdates,
		},
	};

	if (giftInfo) {
		payload = Object.assign(payload, giftInfo);
	}

	if (couponInfo) {
		if (couponInfo.coupon != null) {
			payload.coupon = couponInfo.coupon;
		}

		if (couponInfo.expected_price != null) {
			payload.expectedAmount = couponInfo.expected_price;
		}
	}

	return post(paymentUrl, payload)
		.then(collection => collection.Items[0])
		.then(attempt => parse(attempt))
		.then(attempt =>
			pollPurchaseAttempt(attempt.getID(), attempt.creator, pollUrl)
		);
}

function pollPurchaseAttempt(purchaseId, creator, pollUrl) {
	return new Promise((fulfill, reject) => {
		function pollResponse(attempt) {
			if (/^Failed|Success$/i.test(attempt.state)) {
				return fulfill(attempt);
			}

			setTimeout(check, POLL_INTERVAL);
		}

		function check() {
			//URI Encoding purchase id for polling to work with broken server.
			let params = '?purchaseId=' + encodeURIComponent(purchaseId);

			if (creator) {
				params += '&creator=' + encodeURIComponent(creator);
			}

			get(pollUrl + params)
				.then(o => parse(o.Items))
				.then(items =>
					items.length === 1 ? items[0] : Promise.reject(items)
				)
				.then(pollResponse)
				.catch(reject);
		}

		check();
	});
}
