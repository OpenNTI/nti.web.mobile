import React from 'react';

import Loading from 'common/components/Loading';
import Localized from 'common/components/LocalizedHTML';
import PanelButton from 'common/components/PanelButton';

import BillingInfo from './BillingInfo';
import GiftInfo from './GiftInfo';
import Pricing from './Pricing';

import Store from '../Store';
import {resetProcess, submitPayment} from '../Actions';

import FormattedPriceMixin from 'enrollment/mixins/FormattedPriceMixin';

import {scoped} from 'common/locale';
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
				pricing: Store.getPricing(),
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
			pricing: null,
			giftInfo: null,
			busy: false
		};
	},

	getStripeToken () {
		return this.state.stripeToken;
	},

	getCouponPricing () {
		return Store.getCouponPricing();
	},

	getPricing () {
		return this.state.pricing;
	},

	getGiftInfo () {
		return this.state.giftInfo;
	},

	getPrice () {
		let pricing = this.getCouponPricing();
		let {purchasable} = this.props;
		let price = pricing ? pricing.price : purchasable.amount;

		return this.getFormattedPrice(purchasable.currency, price);
	},

	shouldAllowUpdates () {
		let el = this.refs.subscribeToUpdates;
		return el && el.checked;
	},

	submitPayment (event) {
		event.preventDefault();
		this.setState({ busy: true });

		submitPayment({
			stripeToken: this.getStripeToken(),
			purchasable: this.props.purchasable,
			pricing: this.getPricing(),
			giftInfo: this.getGiftInfo(),
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
					<Loading/>
				) : (
					<div>
						<Pricing purchasable={purchasable} locked />
						<PanelButton buttonClick={this.submitPayment} linkText="Submit Payment">
							<h3>{t('header')}</h3>
							<p>{t('review')}</p>
							<p>{t('salesFinal')}</p>
							<GiftInfo info={giftInfo} edit={edit} />
							<BillingInfo card={stripeToken.card} edit={edit} />
							<p>Clicking submit will charge your card {this.getPrice()}{isGift ? '' : ' and enroll you in the course'}.</p>

							{!AllowVendorUpdates ? '' :
								<div className="subscribe">
									<label>
										<input type="checkbox" ref="subscribeToUpdates" name="subscribe" />
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
