import React from 'react';

/**
 * React Button component
 * @class Button
 */
export default React.createClass({
	displayName: 'Button',

	propTypes: {
		href: React.PropTypes.string,
		className: React.PropTypes.string,
		onClick: React.PropTypes.func,
		enabled: React.PropTypes.bool
	},


	getDefaultProps () {
		return {
			href: '#',
			enabled: true
		};
	},


	onClick (e) {
		let {onClick, enabled, href} = this.props;

		if (enabled && onClick) {
			onClick(...arguments);
		}

		if (href === '#' || !enabled) {
			e.preventDefault();
		}
	},


	render () {

		let css = `button tiny ${this.props.className}`;
		if(!this.props.enabled) {
			css = `disabled ${css}`;
		}

		return (
			<a {...this.props} onClick={this.onClick} className={css}/>
		);
	}
});
