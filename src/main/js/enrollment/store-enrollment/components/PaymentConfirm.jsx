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

var PaymentConfirm = React.createClass({

	_renderBillingInfo: function() {
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
				<div className="small-12 columns">
					<h2>confirm payment</h2>
					<div>
						{this._renderBillingInfo()}
						<Button onClick={this._submitPayment} />
					</div>
				</div>
			</div>
		);
	}

});

module.exports = PaymentConfirm;

