/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Store = require('../Store');
var Actions = require('../Actions');
// var t = require('common/locale').scoped('ENROLLMENT.forms.storeenrollment');
var Button =  require('common/components/forms/Button');

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

// var DUMMY_STRIPE_TOKEN = {
// 	card: {
// 		"address_city": "Norman",
// 		"address_country": "United States",
// 		"address_line1": "NextThought",
// 		"address_line2": "301 David L Boren Blvd STE 3050",
// 		"address_state": "OK",
// 		"address_zip": "73072-7340",
// 		"brand": "MasterCard",
// 		"country": "US",
// 		"customer": null,
// 		"dynamic_last4": null,
// 		"exp_month": 9,
// 		"exp_year": 2019,
// 		"fingerprint": "RzN5PKif5jjDPa0l",
// 		"funding": "unknown",
// 		"id": "card_58n7EUOk6HKEwm",
// 		"last4": "5454",
// 		"name": "Ray Hatfield",
// 		"object": "card",
// 		"type": "MasterCard"
// 	}
// };

var PaymentConfirm = React.createClass({

	_renderBillingInfo: function() {
		// console.warn('USING DUMMY STRIPE TOKEN FOR DEV CONVENIENCE.');
		var stripeToken = Store.getStripeToken();
		var card = stripeToken.card;
		return _billingFields.map(function(fieldname) {
			return (<div>{card[fieldname]}</div>);
		});
	},

	_submitPayment: function() {
		var payload = {
			stripeToken: Store.getStripeToken(),
			purchasable: this.props.purchasable
		};
		Actions.submitPayment(payload);
	},

	render: function() {
		return (
			<div className="row">
				<fieldset className="medium-6 medium-centered columns">
					<legend>confirm payment</legend>
					<div>
						{this._renderBillingInfo()}
						<Button onClick={this._submitPayment}>Submit Payment</Button>
					</div>
				</fieldset>
			</div>
		);
	}

});

module.exports = PaymentConfirm;

