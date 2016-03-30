import React from 'react';

export default function Unknown (props) {
	const {element} = props;

	return (
		<div>Unknown: {element.type}</div>
	);
}

Unknown.propTypes = {
	element: React.PropTypes.object.isRequired
};
