/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var PaymentError = React.createClass({

	render: function() {
		return (
			<div>Drat. Payment Error.</div>
		);
	}

});

module.exports = PaymentError;
