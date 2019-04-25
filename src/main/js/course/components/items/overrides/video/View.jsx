import React from 'react';
// import PropTypes from 'prop-types';

import Page from '../Page';
import Registry from '../Registry';

const MIME_TYPES = {
	'application/vnd.nextthought.ntivideo': true
};

const handles = (obj) => {
	const {location} = obj || {};
	const {item} = location || {};

	return item && MIME_TYPES[item.MimeType];
};

export default
@Registry.register(handles)
class CourseItemAssignment extends React.Component {
	render () {
		return (
			<Page {...this.props}>
				<h1>
					Video
				</h1>
			</Page>
		);
	}
}
