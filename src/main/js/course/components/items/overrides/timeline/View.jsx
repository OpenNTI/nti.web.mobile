import React from 'react';
import PropTypes from 'prop-types';
import QueryString from 'query-string';
import classnames from 'classnames/bind';
import {Card} from '@nti/web-commons';

import Page from '../Page';
import Registry from '../Registry';

import Styles from './View.css';

const cx = classnames.bind(Styles);

const MIME_TYPE = 'application/vnd.nextthought.ntitimeline';
const handles = (obj) => {
	const {location} = obj || {};
	const {item} = location || {};

	return item && item.MimeType === MIME_TYPE;
};

export default class CourseItemTimeline extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		location: PropTypes.object
	}

	render () {
		const {course, location} = this.props;
		const {item} = location || {};
		const params = QueryString.stringify({title: item.label, source: item.href})
			.replace(/%2F/ig, '/');//TimelineJS is not correctly decoding the URI params
		const href = `/app/resources/lib/timeline/embed/index.html?${params}`;


		return (
			<Page {...this.props}>
				<a className={cx('course-items-timeline')} href={href} target="_blank" rel="noopener noreferrer">
					<Card
						data-ntiid={item.NTIID}
						item={item}
						contentPackage={course}
						internalOverride
					/>
				</a>
			</Page>
		);
	}
}

Registry.register(handles)(CourseItemTimeline);
