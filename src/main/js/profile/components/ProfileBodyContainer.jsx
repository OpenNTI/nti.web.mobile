import React from 'react';
import cx from 'classnames';

const FIRST = 0;
const SECOND = 1;

export default React.createClass({
	displayName: 'ProfileBodyContainer',

	propTypes: {
		children: React.PropTypes.any, // exactly one or two children. first is main body. second is sidebar if present.
		className: React.PropTypes.string
	},

	render () {
		let {className, children} = this.props;
		return (
			<div className={cx('profile-body-container', className)}>
				{React.Children.map(children, (child, position) =>
					position === FIRST
						? (<div className="profile-body-main">{child}</div>)
						: position === SECOND
							? (<aside className="profile-body-aside">{child}</aside>)
							: null)}
			</div>
		);
	}
});
