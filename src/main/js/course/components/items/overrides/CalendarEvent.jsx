import React from 'react';
import PropTypes from 'prop-types';

import { Event } from '@nti/web-calendar';

import Page from './Page';
import Registry from './Registry';

const MIME_TYPES = {
	'application/vnd.nextthought.nticalendareventref': true,
};

const handles = obj => {
	const { location } = obj || {};
	const { item } = location || {};

	return item && MIME_TYPES[item.MimeType];
};

export default class CourseItemCalendarEvent extends React.Component {
	static propTypes = {
		location: PropTypes.shape({
			item: PropTypes.object,
		}),
	};

	render() {
		const { location } = this.props;
		const { item: { CalendarEvent: event } = {} } = location || {};

		return (
			<Page {...this.props}>
				<Event.View event={event} dialog={false} controls={false} />
			</Page>
		);
	}
}

Registry.register(handles)(CourseItemCalendarEvent);
