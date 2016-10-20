import React from 'react';

import {Loading, PanelButton, LocalizedHTML as Localized} from 'nti-web-commons';

import BillingInfo from './BillingInfo';
import GiftInfo from './GiftInfo';
import Pricing from './Pricing';

import Store from '../Store';
import {resetProcess, submitPayment} from '../Actions';

import FormattedPriceMixin from 'enrollment/mixins/FormattedPriceMixin';

import {scoped} from 'nti-lib-locale';
let t = scoped('ENROLLMENT.CONFIRMATION');


export default React.createClass({

	displayName: 'store-enrollment:PaymentConfirm',

	mixins: [FormattedPriceMixin],

	propTypes: {
		purchasable: React.PropTypes.object
	},

	componentWillMount () {
		try {
			const stripeToken = Store.getStripeToken();
			if (!stripeToken) {
				this.reset();
			}

			this.setState({
				stripeToken,
				couponInfo: Store.getCouponInfo(),
				giftInfo: Store.getGiftInfo()
			});

		}
		catch(e) {
			this.reset();
		}
	},


	reset () {
		resetProcess({ gift: (Store.getGiftInfo() !== null) });
	},


	getInitialState () {
		return {
			stripeToken: null,
			couponInfo: null,
			giftInfo: null,
			busy: false
		};
	},


	getPrice () {
		const {purchasable} = this.props;
		const pricing = Store.getCouponPricing();
		const price = pricing ? pricing.price : purchasable.amount;

		return this.getFormattedPrice(purchasable.currency, price);
	},


	shouldAllowUpdates () {
		let el = this.subscribeToUpdates;
		return el && el.checked;
	},

	submitPayment (event) {
		event.preventDefault();

		const {state: {couponInfo, giftInfo, stripeToken}} = this;

		this.setState({ busy: true });

		submitPayment({
			purchasable: this.props.purchasable,
			stripeToken, couponInfo, giftInfo,
			allowVendorUpdates: this.shouldAllowUpdates()
		});
	},

	render () {
		const {props: {purchasable}, state: {busy, stripeToken, giftInfo}} = this;
		const {VendorInfo: {AllowVendorUpdates} = {}} = purchasable || {};
		const isGift = giftInfo !== null;
		const edit = isGift ? 'gift/' : '';

		return (
			<div className="payment-confirm">
				{(busy || !stripeToken) ? (
					<Loading.Mask />
				) : (
					<div>
						<Pricing purchasable={purchasable} locked />
						<PanelButton onClick={this.submitPayment} linkText="Submit Payment">
							<h3>{t('header')}</h3>
							<p>{t('review')}</p>
							<p>{t('salesFinal')}</p>
							<GiftInfo info={giftInfo} edit={edit} />
							<BillingInfo card={stripeToken.card} edit={edit} />
							<p>Clicking submit will charge your card {this.getPrice()}{isGift ? '' : ' and enroll you in the course'}.</p>

							{!AllowVendorUpdates ? '' :
								<div className="subscribe">
									<label>
										<input type="checkbox" ref={x => this.subscribeToUpdates = x} name="subscribe" />
										<Localized tag="span" stringId="ENROLLMENT.SUBSCRIBE.label" />
										<Localized tag="p" stringId="ENROLLMENT.SUBSCRIBE.legal" />
									</label>
								</div>
							}

						</PanelButton>
					</div>
				)}
			</div>
		);
	}

});
