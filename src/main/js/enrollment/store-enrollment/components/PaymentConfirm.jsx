/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Store = require('../Store');
var Actions = require('../Actions');
var PanelButton = require('common/components/PanelButton');
var ErrorWidget = require('common/components/Error');
var Loading = require('common/components/Loading');
var BillingInfo = require('./BillingInfo');
var GiftInfo = require('./GiftInfo');
var Pricing = require('./Pricing');

var FormattedPriceMixin = require('enrollment/mixins/FormattedPriceMixin');

var _t = require('common/locale').scoped('ENROLLMENT.CONFIRMATION');


var PaymentConfirm = React.createClass({

	mixins: [FormattedPriceMixin],

	componentWillMount: function() {
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


	componentDidMount: function() {
		if (!this.state.stripeToken) {
			Actions.resetProcess();
		}
	},


	getInitialState: function() {
		return {
			stripeToken: null,
			pricing: null,
			giftInfo: null,
			busy: false
		};
	},

	_getStripeToken: function() {
		return this.state.stripeToken;
	},

	_getCouponPricing: function() {
		return Store.getCouponPricing();
	},

	_getPricing: function() {
		return this.state.pricing;
	},

	_getGiftInfo: function() {
		return this.state.giftInfo;
	},

	_getPrice: function() {
		var pricing = this._getCouponPricing();
		var price = pricing ? pricing.PurchasePrice : this.props.purchasable.Amount;

		return this.getFormattedPrice(this.props.purchasable.Currency, price);
	},

	_submitPayment: function(event) {
		event.preventDefault();
		this.setState({
			busy: true
		});
		var payload = {
			stripeToken: this._getStripeToken(),
			purchasable: this.props.purchasable,
			pricing: this._getPricing(),
			giftInfo: this._getGiftInfo()
		};
		Actions.submitPayment(payload);
	},

	render: function() {

		if (this.state.error || !this.state.stripeToken) {
			return <ErrorWidget error="No data"/>;
		}

		if (this.state.busy) {
			return <Loading />;
		}

		var purchasable = this.props.purchasable;

		var price = this._getPrice();
		var edit = this.state.giftInfo && 'gift/';


		return (
			<div className="payment-confirm">
				<Pricing purchasable={purchasable} locked={true} />
				<PanelButton className="medium-8 medium-centered columns" buttonClick={this._submitPayment} linkText="Submit Payment">
					<h3>{_t("header")}</h3>
					<p>{_t("review")}</p>
					<p>{_t("salesFinal")}</p>
					<GiftInfo info={this.state.giftInfo} edit={edit} />
					<BillingInfo card={this.state.stripeToken.card} edit={edit} />
					<p>Clicking submit will charge your card {price} and enroll you in the course.</p>

				</PanelButton>
			</div>
		);
	}

});

module.exports = PaymentConfirm;
