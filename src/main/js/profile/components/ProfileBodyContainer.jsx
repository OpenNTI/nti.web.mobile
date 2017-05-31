import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const FIRST = 0;
const SECOND = 1;

export default function ProfileBodyContainer ({className, children}) {
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

ProfileBodyContainer.propTypes = {
	children: PropTypes.any, // exactly one or two children. first is main body. second is sidebar if present.
	className: PropTypes.string
};
