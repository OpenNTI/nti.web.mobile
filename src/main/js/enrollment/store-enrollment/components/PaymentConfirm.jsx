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
var FormattedPriceMixin = require('enrollment/mixins/FormattedPriceMixin');
var t = require('common/locale').translate;

var _stripeToken;
var _coupon;
var _giftInfo;

var PaymentConfirm = React.createClass({

	mixins: [FormattedPriceMixin],

	componentWillMount: function() {
		try {
			_stripeToken = Store.getStripeToken();
			_coupon = Store.getCoupon();
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

	_getCoupon: function() {
		return _coupon;
	},

	_getGiftInfo: function() {
		return _giftInfo;
	},

	_submitPayment: function(event) {
		event.preventDefault();
		this.setState({
			busy: true
		});
		var payload = {
			stripeToken: this._getStripeToken(),
			purchasable: this.props.purchasable,
			coupon: this._getCoupon(),
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
		var price = this.getFormattedPrice(purchasable.Currency, purchasable.Amount)
		var edit = _giftInfo ? '../gift/' : '../';

		return (
			<div className="row">
				<PanelButton className="column" buttonClick={this._submitPayment} linkText="Submit Payment">
					<GiftInfo info={_giftInfo} edit={edit} />
					<BillingInfo card={_stripeToken.card} edit={edit} />
					<p>Clicking submit will charge your card {price} and enroll you in the course.</p>
					
				</PanelButton>
			</div>
		);
	}

});

module.exports = PaymentConfirm;
