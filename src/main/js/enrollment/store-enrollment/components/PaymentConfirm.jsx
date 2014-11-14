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

// the fields we want to display from the stripe token.
var _billingFields = [
	'name',
	'address_line1',
	'address_line2',
	'address_city',
	'address_state',
	'address_zip',
	'address_country',
	'last4',
	'exp_month',
	'exp_year'
];



var PaymentConfirm = React.createClass({

	mixins: [FormattedPriceMixin],

	getInitialState: function() {
		return {
			busy: false
		};
	},

	_getStripeToken: function() {
		return Store.getStripeToken();
	},

	_renderBillingInfo: function() {
		var stripeToken = this._getStripeToken();	
		var card = stripeToken.card;
		return _billingFields.map(function(fieldname) {
			return (<div>{card[fieldname]}</div>);
		});
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

		if (this.state.busy) {
			return <Loading />;
		}

		var purchasable = this.props.purchasable;
		var price = this.getFormattedPrice(purchasable.Currency, purchasable.Amount);

		return (
			<div className="row">
				<PanelButton className="column" buttonClick={this._submitPayment} linkText="Submit Payment">
					<h2>Confirm payment</h2>
					<p>Clicking submit will charge your card {price} and enroll you in the course.</p>
					
				</PanelButton>
			</div>
		);
	}

});

module.exports = PaymentConfirm;
