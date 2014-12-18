/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');

var PaymentComplete = React.createClass({

	render: function() {
		return (
			<PanelButton>
				(payment complete)
			</PanelButton>
		);
	}

});

module.exports = PaymentComplete;
