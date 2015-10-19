import React from 'react';

import ErrorWidget from 'common/components/Error';
import Loading from 'common/components/Loading';
import Localized from 'common/components/LocalizedHTML';
import PanelButton from 'common/components/PanelButton';

import BillingInfo from './BillingInfo';
import GiftInfo from './GiftInfo';
import Pricing from './Pricing';

import Store from '../Store';
import * as Actions from '../Actions';

import FormattedPriceMixin from 'enrollment/mixins/FormattedPriceMixin';

import {scoped} from 'common/locale';
let t = scoped('ENROLLMENT.CONFIRMATION');

const getCouponPricing = 'PaymentConfirm:getCouponPricing';
const getStripeToken = 'PaymentConfirm:getStripeToken';
const getPricing = 'PaymentConfirm:getPricing';
const getGiftInfo = 'PaymentConfirm:getGiftInfo';
const shouldAllowUpdates = 'PaymentConfirm:shouldAllowUpdates';
const getPrice = 'PaymentConfirm:getPrice';
const submitPayment = 'PaymentConfirm:submitPayment';

export default React.createClass({

	displayName: 'store-enrollment:PaymentConfirm',

	mixins: [FormattedPriceMixin],

	propTypes: {
		purchasable: React.PropTypes.object
	},

	componentWillMount () {
		try {
			this.setState({
				stripeToken: Store.getStripeToken(),
				pricing: Store.getPricing(),
				giftInfo: Store.getGiftInfo()
			});
		}
		catch(e) {
			this.setState({
				error: true
			});
		}
	},


	componentDidMount () {
		if (!this.state.stripeToken) {
			Actions.resetProcess({
				gift: (Store.getGiftInfo() !== null)
			});
		}
	},

	getInitialState () {
		return {
			stripeToken: null,
			pricing: null,
			giftInfo: null,
			busy: false
		};
	},

	[getStripeToken] () {
		return this.state.stripeToken;
	},

	[getCouponPricing] () {
		return Store.getCouponPricing();
	},

	[getPricing] () {
		return this.state.pricing;
	},

	[getGiftInfo] () {
		return this.state.giftInfo;
	},

	[getPrice] () {
		let pricing = this[getCouponPricing]();
		let {purchasable} = this.props;
		let price = pricing ? pricing.price : purchasable.amount;

		return this.getFormattedPrice(purchasable.currency, price);
	},

	[shouldAllowUpdates] () {
		let el = this.refs.subscribeToUpdates;
		return el && el.checked;
	},

	[submitPayment] (event) {
		event.preventDefault();
		this.setState({
			busy: true
		});
		let payload = {
			stripeToken: this[getStripeToken](),
			purchasable: this.props.purchasable,
			pricing: this[getPricing](),
			giftInfo: this[getGiftInfo](),
			allowVendorUpdates: this[shouldAllowUpdates]()
		};
		Actions.submitPayment(payload);
	},

	render () {

		if (this.state.error || !this.state.stripeToken) {
			return <ErrorWidget error="No data"/>;
		}

		if (this.state.busy) {
			return <Loading />;
		}

		let purchasable = this.props.purchasable;

		let price = this[getPrice]();
		let edit = this.state.giftInfo && 'gift/';
		let allowVendorUpdates = purchasable.VendorInfo.AllowVendorUpdates;
		let isGift = this.state.giftInfo !== null;

		return (
			<div className="payment-confirm">
				<Pricing purchasable={purchasable} locked />
				<PanelButton className="medium-8 medium-centered columns" buttonClick={this[submitPayment]} linkText="Submit Payment">
					<h3>{t('header')}</h3>
					<p>{t('review')}</p>
					<p>{t('salesFinal')}</p>
					<GiftInfo info={this.state.giftInfo} edit={edit} />
					<BillingInfo card={this.state.stripeToken.card} edit={edit} />
					<p>Clicking submit will charge your card {price}{isGift ? '' : ' and enroll you in the course'}.</p>

					{!allowVendorUpdates ? '' :
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
		);
	}

});
