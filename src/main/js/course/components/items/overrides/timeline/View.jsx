import React from 'react';
// import PropTypes from 'prop-types';

import Page from '../Page';
import Registry from '../Registry';

const MIME_TYPE = 'application/vnd.nextthought.ntitimeline';
const handles = (obj) => {
	const {location} = obj || {};
	const {item} = location || {};

	return item && item.MimeType === MIME_TYPE;
};

export default
@Registry.register(handles)
class CourseItemAssignment extends React.Component {
	render () {
		return (
			<Page {...this.props}>
				<h1>
					Timeline
				</h1>
			</Page>
		);
	}
}
