import React from 'react';
import cx from 'classnames';

TokenTag.propTypes = {
	className: React.PropTypes.string,
	selected: React.PropTypes.bool,
	name: React.PropTypes.string,
	value: React.PropTypes.string.isRequired
};

export default function TokenTag ({className, selected, name, value, ...props}) {

	return (
		<div data-value={value} className={cx('token pill', className, {selected})} {...props}>
			{name || value}
		</div>
	);
}
