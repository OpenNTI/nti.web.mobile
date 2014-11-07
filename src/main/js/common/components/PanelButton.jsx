/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

/**
*	Renders an info panel with a link/button.
*/
var PanelButton = React.createClass({

	getDefaultProps: function() {
		return {
			linkText: 'OK',
			href: '#'
		};
	},

	_button: function() {
		return this.transferPropsTo(
			<a href={this.props.href} className="button tiny radius column">{this.props.linkText}</a>
		);
	},

	render: function() {
		return (
			<div className='panel-button'>
				<div className="panel radius">
					{this.props.children}
				</div>
				{this._button()}
			</div>
		);
	}

});

module.exports = PanelButton;

