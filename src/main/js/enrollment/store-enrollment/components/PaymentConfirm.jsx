import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Loading, PanelButton} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {rawContent} from '@nti/lib-commons';

import FormattedPriceMixin from 'enrollment/mixins/FormattedPriceMixin';

import {resetProcess, submitPayment} from '../Actions';
import Store from '../Store';

import BillingInfo from './BillingInfo';
import GiftInfo from './GiftInfo';
import Pricing from './Pricing';

const t = scoped('enrollment.confirmation', {
	header: 'Review and Pay',
	review: 'Please take a moment to review your order and submit your payment.',
	salesFinal: 'All sales are final.',
});

const t2 = scoped('enrollment.subscribe');


export default createReactClass({

	displayName: 'store-enrollment:PaymentConfirm',

	mixins: [FormattedPriceMixin],

	propTypes: {
		purchasable: PropTypes.object
	},


	attachSubscribeCheckboxRef (x) { this.subscribeToUpdates = x; },


	componentDidMount () {
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
		const {vendorInfo: {AllowVendorUpdates} = {}} = purchasable || {};
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

							{!AllowVendorUpdates ? '' : (
								<div className="subscribe">
									<label>
										<input type="checkbox" ref={this.attachSubscribeCheckboxRef} name="subscribe" />
										<span {...rawContent(t2('label'))} />
										<p {...rawContent(t2('legal'))} />
									</label>
								</div>
							)}

						</PanelButton>
					</div>
				)}
			</div>
		);
	}

});
