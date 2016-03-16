import React from 'react';

export default function UnknownWidget ({item}) {
	return (
		<div>UnknownWidget: {item.MimeType}</div>
	);
}

UnknownWidget.propTypes = {
	item: React.PropTypes.any.isRequired
};
