import React from 'react';
import cx from 'classnames';

export default function TinyLoader ({className}) {
	return (
		<ul className={cx('tinyloader', className)}>
			<li /><li /><li />
		</ul>
	);
}

TinyLoader.propTypes = {
	className: React.PropTypes.string
};
