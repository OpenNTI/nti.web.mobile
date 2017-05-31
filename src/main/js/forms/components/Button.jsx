import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import cx from 'classnames';

export default createReactClass({
	displayName: 'Button',

	propTypes: {
		href: PropTypes.string,
		className: PropTypes.string,
		onClick: PropTypes.func,
		enabled: PropTypes.bool
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
		const {className, enabled, ...props} = this.props;
		const css = cx('button tiny', className, {disabled: !enabled});

		return (
			<a {...props} onClick={this.onClick} className={css}/>
		);
	}
});
