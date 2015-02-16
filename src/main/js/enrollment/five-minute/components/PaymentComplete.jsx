'use strict';

var React = require('react');
var PanelButton = require('common/components/PanelButton');
var QueryString = require('query-string');

var PaymentComplete = React.createClass({

	componentWillMount: function() {
		var loc = global.location || {};
		var paymentState = (QueryString.parse(loc.search).State||'').toLowerCase() === 'true';
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
