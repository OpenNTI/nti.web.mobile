'use strict';

var React = require('react/addons');
var PanelButton = require('./PanelButton');

/**
*	Renders an info panel with a link/button.
*/
var PanelNoButton = React.createClass({

	render: function() {
		return (
			<PanelButton {...this.props}>
				{this.props.children}
			</PanelButton>
		);
	}

});

module.exports = PanelNoButton;
