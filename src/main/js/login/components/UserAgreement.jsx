/**
 * @jsx React.DOM
 */

'use strict'

var React = require('react/addons');

var UserAgreement = React.createClass({

	render: function() {
		return (
				<iframe
					className="agreement"
					seamless="seamless"
					src="https://docs.google.com/document/pub?id=1rM40we-bbPNvq8xivEKhkoLE7wmIETmO4kerCYmtISM&amp;embedded=true"
				></iframe>
		);
	}

});

module.exports = UserAgreement;
