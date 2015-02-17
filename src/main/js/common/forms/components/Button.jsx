import React from 'react';

/**
 * React Button component
 * @class Button
 */
export default React.createClass({

	getDefaultProps () {
		return {
			href: '#',
			enabled: true
		};
	},


	onClick (e) {
		let {onClick, enabled, href} = this.props;

		if(enabled && onClick) {
			onClick(...arguments);
		}

		if(href==='#' || !enabled) {
			e.preventDefault();
		}
	},


	render () {

		var css = `button tiny ${this.props.className}`;
		if(!this.props.enabled) {
			css = `disabled ${css}`;
		}

		return (
			<a {...this.props} onClick={this.onClick} className={css}/>
		);
	}
});
