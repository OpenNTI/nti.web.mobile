import React from 'react';
import {translate as t} from 'common/locale';



/**
 *	Renders an info panel with a link/button.
 */
export default React.createClass({
	displayName: 'PanelButton',

	propTypes: {
		linkText: React.PropTypes.string, // the text of the button
		href: React.PropTypes.string, // the href of the button, if applicable
		buttonClick: React.PropTypes.func, // click handler for the button
		button: React.PropTypes.element // pass in your own button if you need special behavior or treatment
	},

	getDefaultProps () {
		return {
			linkText: t('BUTTONS.ok'),
			href: '#',
			buttonClick: null
		};
	},

	renderButton () {
		let {button, href, buttonClick, onClick, linkText} = this.props;

		onClick = onClick || buttonClick;

		if (!button && (!href || href === '#') && !onClick) {
			return null;
		}

		let props = {
			onClick,
			href,
			className: 'button tiny column',
			children: linkText
		};

		return button || <a {...props}/>;
	},


	render () {
		return (
			<div {...this.props}>
				<div className='panel-button'>
					{this.props.children}
					{this.renderButton()}
				</div>
			</div>
		);
	}

});
