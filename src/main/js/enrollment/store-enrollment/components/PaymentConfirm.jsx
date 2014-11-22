/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Store = require('../Store');
var Actions = require('../Actions');
var PanelButton = require('common/components/PanelButton');
var Loading = require('common/components/Loading');
var BillingInfo = require('./BillingInfo');
var GiftInfo = require('./GiftInfo');
var Pricing = require('./Pricing');
var FormattedPriceMixin = require('enrollment/mixins/FormattedPriceMixin');
var _t = require('common/locale').scoped('ENROLLMENT.CONFIRMATION');
var t = require('common/locale').translate;

var _stripeToken;
var _pricing;
var _giftInfo;

var PaymentConfirm = React.createClass({

	mixins: [FormattedPriceMixin],

	componentWillMount: function() {
		try {
			_stripeToken = Store.getStripeToken();
			_pricing = Store.getPricing();
			_giftInfo = Store.getGiftInfo();
		}
		catch(e) {
			this.setState({
				error: true
			});
		}
	},

	getInitialState: function() {
		return {
			busy: false
		};
	},

	_getStripeToken: function() {
		return _stripeToken;
	},

	_getCouponPricing: function() {
		return Store.getCouponPricing();
	},

	_getPricing: function() {
		return _pricing;
	},

	_getGiftInfo: function() {
		return _giftInfo;
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

		if (this.state.error || !_stripeToken) {
			return (<PanelButton className="column" href="../">
				<p>{t('ENROLLMENT.NO_STRIPE_TOKEN')}</p>
			</PanelButton>);
		}

		if (this.state.busy) {
			return <Loading />;
		}

		var purchasable = this.props.purchasable;
		var price = this._getPrice();
		var edit = _giftInfo ? '../gift/' : '../';

		return (
			<div className="row payment-confirm">
				<Pricing purchasable={purchasable} locked={true} />
				<PanelButton className="medium-8 medium-centered columns" buttonClick={this._submitPayment} linkText="Submit Payment">
					<h3>{_t("header")}</h3>
					<p>{_t("review")}</p>
					<p>{_t("salesFinal")}</p>
					<GiftInfo info={_giftInfo} edit={edit} />
					<BillingInfo card={_stripeToken.card} edit={edit} />
					<p>Clicking submit will charge your card {price} and enroll you in the course.</p>

				</PanelButton>
			</div>
		);
	}

});

module.exports = PaymentConfirm;
