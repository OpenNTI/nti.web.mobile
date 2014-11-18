/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Store = require('../Store');
var Actions = require('../Actions');
var PanelButton = require('common/components/PanelButton');
var Loading = require('common/components/Loading');
var FormattedPriceMixin = require('enrollment/mixins/FormattedPriceMixin');
var t = require('common/locale').translate;

var _stripeToken;

var PaymentConfirm = React.createClass({

	mixins: [FormattedPriceMixin],

	componentWillMount: function() {
		try {
			_stripeToken = Store.getStripeToken();
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

	_renderBillingInfo: function() {
		var card = _stripeToken.card;

		return (
			<fieldset>
				<div>{card.name}</div>
				<div>{card.address_line1}</div>
				{card.address_line2 ? <div>{card.address_line2}</div> : null}
				<div>{card.address_city}, {card.address_state} {card.address_zip}</div>
				<div>**** **** **** {card.last4} ({card.exp_month}/{card.exp_year})</div>
				<a href='../'>edit</a>
			</fieldset>
		);

		// return _billingFields.map(function(fieldname) {
		// 	return (<div>{card[fieldname]}</div>);
		// });
	},

	_submitPayment: function(event) {
		event.preventDefault();
		this.setState({
			busy: true
		});
		var payload = {
			stripeToken: this._getStripeToken(),
			purchasable: this.props.purchasable
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
		var price = this.getFormattedPrice(purchasable.Currency, purchasable.Amount);

		return (
			<div className="row">
				<PanelButton className="column" buttonClick={this._submitPayment} linkText="Submit Payment">
					<h2>Confirm payment</h2>
					{this._renderBillingInfo()}
					<p>Clicking submit will charge your card {price} and enroll you in the course.</p>
					
				</PanelButton>
			</div>
		);
	}

});

module.exports = PaymentConfirm;
