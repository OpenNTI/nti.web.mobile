/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');
var t = require('common/locale').scoped('ENROLLMENT');
var Actions = require('../Actions');
var Err = require('common/components/Error');

var Payment = React.createClass({

	propTypes: {
		paymentLink: React.PropTypes.string.isRequired, // dataserver pay and enroll link ('fmaep.pay.and.enroll')
		ntiCrn: React.PropTypes.string.isRequired, // passed to dataserver to get payment site url
		ntiTerm: React.PropTypes.string.isRequired // passed to dataserver to get payment site url
	},

	buttonClick: function(event) {
		event.preventDefault();
		Actions.doExternalPayment({
			link: this.props.paymentLink,
			ntiCrn: this.props.ntiCrn,
			ntiTerm: this.props.ntiTerm
		});
	},

	render: function() {

		if (!this.props.paymentLink) {
			var error = new Error('paymentLink property is required.');
			return <Err error={error} />;
		}

		return (
			<PanelButton
				buttonClick={this.buttonClick}
				linkText={t("proceedToPayment")}>
					<span>You will be taken to an external site for payment.</span>
			</PanelButton>
		);
	}

});

module.exports = Payment;
