/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var t = require('common/locale').translate;
var PanelButton = require('./PanelButton');

/**
*	Renders an info panel with a link/button.
*/
var PanelNoButton = React.createClass({

	render: function() {
		return this.transferPropsTo(
			<PanelButton button={true}>
				{this.props.children}
			</PanelButton>
		);
	}

});

module.exports = PanelNoButton;
