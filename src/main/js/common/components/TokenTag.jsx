import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

TokenTag.propTypes = {
	className: PropTypes.string,
	selected: PropTypes.bool,
	name: PropTypes.string,
	value: PropTypes.string.isRequired,
};

export default function TokenTag({
	className,
	selected,
	name,
	value,
	...props
}) {
	return (
		<div
			data-value={value}
			className={cx('token pill', className, { selected })}
			{...props}
		>
			{name || value}
		</div>
	);
}
