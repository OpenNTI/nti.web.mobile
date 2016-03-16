import React from 'react';

import cx from 'classnames';

export default function ProfileCard ({children, className, title}) {
	return (
		<li className={cx('profile-card', className)}>
			{title && <h1>{title}</h1>}
			{children}
		</li>
	);
}

ProfileCard.propTypes = {
	title: React.PropTypes.string,
	className: React.PropTypes.string,
	children: React.PropTypes.any
};
