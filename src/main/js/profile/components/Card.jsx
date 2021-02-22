import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default function ProfileCard({ children, className, title }) {
	return (
		<li className={cx('profile-card', className)}>
			{title && <h1>{title}</h1>}
			{children}
		</li>
	);
}

ProfileCard.propTypes = {
	title: PropTypes.string,
	className: PropTypes.string,
	children: PropTypes.any,
};
