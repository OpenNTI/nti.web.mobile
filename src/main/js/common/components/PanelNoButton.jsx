/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PanelButton = require('./PanelButton');

/**
*	Renders an info panel with a link/button.
*/
var PanelNoButton = React.createClass({

	render: function() {
		return this.transferPropsTo(
			<PanelButton>
				{this.props.children}
			</PanelButton>
		);
	}

});

module.exports = PanelNoButton;
