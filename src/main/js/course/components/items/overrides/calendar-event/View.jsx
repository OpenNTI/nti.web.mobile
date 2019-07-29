import React from 'react';
import PropTypes from 'prop-types';
import {Event} from '@nti/web-calendar';
import classnames from 'classnames/bind';

import Page from '../Page';
import Registry from '../Registry';

import Styles from './View.css';

const cx = classnames.bind(Styles);

const MIME_TYPES = {
	'application/vnd.nextthought.nticalendareventref': true
};

const handles = (obj) => {
	const {location} = obj || {};
	const {item} = location || {};

	return item && MIME_TYPES[item.MimeType];
};

export default
@Registry.register(handles)
class CourseItemAssignment extends React.Component {
	static propTypes = {
		location: PropTypes.shape({
			item: PropTypes.object
		})
	}

	render () {
		const {location} = this.props;
		const {item: {CalendarEvent: event} = {}} = location || {};

		return (
			<Page {...this.props}>
				<Event.View event={event} className={cx('course-item-event')} nonDialog noControls />
			</Page>
		);
	}
}