import PropTypes from 'prop-types';
import React from 'react';

ReturnTo.propTypes = {
	href: PropTypes.string,
	label: PropTypes.string
};

export default function ReturnTo ({href, label}) {
	const props = {
		className: 'return-to',
		href,
		title: label,
		children: label
	};

	return <a {...props}/>;
}
