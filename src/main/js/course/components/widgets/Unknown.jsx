import PropTypes from 'prop-types';
import React from 'react';

export default function CourseOverviewUnknown ({item}) {
	let type = (item.MimeType || 'Unknown')
		.replace('application/vnd.nextthought.', '');

	return (<div>Unknown Type: {type}</div>);
}

CourseOverviewUnknown.propTypes = {
	item: PropTypes.shape({
		MimeType: PropTypes.string
	}).isRequired
};
