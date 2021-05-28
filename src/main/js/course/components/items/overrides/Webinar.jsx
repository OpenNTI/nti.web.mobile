import React from 'react';

import { Content } from '@nti/web-course';

import Page from './Page';
import Registry from './Registry';

const { Webinar } = Content.Viewer.ContentTypes;

const MIME_TYPES = {
	'application/vnd.nextthought.webinarasset': true,
};

const handles = obj => {
	const { location } = obj || {};
	const { item } = location || {};

	return item && MIME_TYPES[item.MimeType];
};

export default class CourseItemAssignment extends React.Component {
	render() {
		return (
			<Page {...this.props}>
				<Webinar {...this.props} />
			</Page>
		);
	}
}

Registry.register(handles)(CourseItemAssignment);
