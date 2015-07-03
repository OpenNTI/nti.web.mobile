import React from 'react';

import cx from 'classnames';

export default React.createClass({
	displayName: 'Profile:Card',

	propTypes: {
		title: React.PropTypes.string,
		className: React.PropTypes.string,
		children: React.PropTypes.any
	},

	render () {
		let {children, className, title} = this.props;
		return (
			<li className={cx('profile-card', className)}>
				{title && <h1>{title}</h1>}
				{children}
			</li>
		);
	}
});
