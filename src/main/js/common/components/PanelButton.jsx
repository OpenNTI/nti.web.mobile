'use strict';

var React = require('react');
var t = require('common/locale').translate;

/**
*	Renders an info panel with a link/button.
*/
var PanelButton = React.createClass({

	propTypes: {
		linkText: React.PropTypes.string, // the text of the button
		href: React.PropTypes.string, // the href of the button, if applicable
		buttonClick: React.PropTypes.func, // click handler for the button
		button: React.PropTypes.element // pass in your own button if you need special behavior or treatment
	},

	getDefaultProps: function() {
		return {
			linkText: t('BUTTONS.ok'),
			href: '#',
			buttonClick: null
		};
	},

	_button: function() {
		if (!this.props.button && (!this.props.href || this.props.href === '#') && !this.props.buttonClick && !this.props.onClick) {
			return null;
		}
		return this.props.button || <a href={this.props.href}
			className="button tiny radius column"
			onClick={this.props.buttonClick}>{this.props.linkText}</a>;
	},

	render: function() {
		return (
			<div {...this.props}>
				<div className='panel-button'>
					{this.props.children}
					{this._button()}
				</div>
			</div>
		);
	}

});

module.exports = PanelButton;
