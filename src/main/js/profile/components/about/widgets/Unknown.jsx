import PropTypes from 'prop-types';
import React from 'react';

export default function UnknownWidget({ item }) {
	return <div>UnknownWidget: {item.MimeType}</div>;
}

UnknownWidget.propTypes = {
	item: PropTypes.any.isRequired,
};
