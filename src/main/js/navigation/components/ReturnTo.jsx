import React from 'react';

ReturnTo.propTypes = {
	href: React.PropTypes.string,
	label: React.PropTypes.string
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
