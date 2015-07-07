import React from 'react';
import cx from 'classnames';

export default React.createClass({
	displayName: 'ProfileBodyContainer',

	propTypes: {
		children: React.PropTypes.any, // exactly one or two children. first is main body. second is sidebar if present.
		className: React.PropTypes.string
	},

	render () {
		return (
			<div className={cx('profile-body-container', this.props.className)}>
				<div className="profile-body-main">{this.props.children[0]}</div>
				{this.props.children.length > 1 && <aside className="profile-body-aside">{this.props.children[1]}</aside>}
			</div>
		);
	}
});
