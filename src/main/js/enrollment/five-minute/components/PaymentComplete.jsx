/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');
var fromQueryString = require('dataserverinterface/utils/object-from-querystring');

var PaymentComplete = React.createClass({

	componentWillMount: function() {
		var loc = global.location || {};
		var paymentState = (fromQueryString(loc.search).State||'').toLowerCase() === 'true';
		this.setState({
			paymentState: paymentState
		});
	},

	// if enrollment was successful we won't get here. there's an enrollment check
	// in a parent view that will render 
	render: function() {

		var message = this.state.paymentState ? '' : 'Payment was not processed.';

		return (
			<PanelButton href="../../../" linkText='Go back'>
				{message}
			</PanelButton>
		);
	}

});

module.exports = PaymentComplete;
