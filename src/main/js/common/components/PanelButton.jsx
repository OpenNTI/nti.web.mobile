/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var t = require('common/locale').translate;

/**
*	Renders an info panel with a link/button.
*/
var PanelButton = React.createClass({

	propTypes: {
		linkText: React.PropTypes.string, // the text of the button
		href: React.PropTypes.string, // the href of the button, if applicable
		buttonClick: React.PropTypes.func // click handler for the button
	},

	getDefaultProps: function() {
		return {
			linkText: t('BUTTONS.OK'),
			href: '#',
			buttonClick: null
		};
	},

	_button: function() {
		return this.props.button || <a href={this.props.href}
			className="button tiny radius column"
			onClick={this.props.buttonClick}>{this.props.linkText}</a>;
	},

	render: function() {
		return this.transferPropsTo(
			<div className="row">
				<div className='panel-button column'>
					<div className="panel radius">
						{this.props.children}
					</div>
					{this._button()}
				</div>
			</div>
		);
	}

});

module.exports = PanelButton;

