import React from 'react';
import cx from 'classnames';

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
		const {className, enabled} = this.props;
		const css = cx('button tiny', className, {disabled: !enabled});

		return (
			<a {...this.props} onClick={this.onClick} className={css}/>
		);
	}
});
