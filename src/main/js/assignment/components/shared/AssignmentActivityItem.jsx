import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cx from 'classnames';
import {join} from 'path';

import {rawContent} from 'nti-commons';
import {encodeForURI} from 'nti-lib-ntiids';
import {DateTime, DisplayName} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';


const DEFAULT_TEXT = {
	'grade-received': 'Grade Received:  %(title)s',
	'late-assignment': 'Assignment Past Due:  %(title)s',
	'new-assignment': 'New Assignment:  %(title)s',

	'submitted-assignment': 'Assignment Submitted:  %(title)s',
	'user-submitted-assignment': '%(name)s Submitted Assignment:  %(title)s',

	'they-feedback': '%(name)s left feedback on: %(title)s',
	'you-feedback-theirs': 'You commented on %(title)s (%(name)s)',
	'you-feedback': 'You commented on: %(title)s'
};

const t = scoped('COURSE.ASSIGNMENTS.ACTIVITY', DEFAULT_TEXT);


const hasName = type => (t(type, {name: type, title: ''}) || '').indexOf(type) >= 0;

const linkToStudentView = (user) => user;

const GOTO_HASH = {
	'they-feedback': '#feedback',
	'you-feedback-theirs': '#feedback',
	'you-feedback': '#feedback'
};

ActivityItem.propTypes = {
	event: React.PropTypes.object.isRequired
};

ActivityItem.contextTypes = {
	isInstructor: React.PropTypes.bool
};

export default function ActivityItem ({event}, {isInstructor}) {
	const {feedbackAuthor, date, title, type, unread, user, assignment} = event;
	const today = new Date((new Date()).setHours(0, 0, 0, 0));

	let format = 'MMM D'; // "Jan 2" ... Short month, Day of month without zero padding
	if (date > today) {
		format = 'h:mm a'; // "8:05 pm" ...Hours without zero padding, ":", minutes with zero padding, lower-case "am/pm"
	}

	const href = (
		isInstructor && linkToStudentView(user, type)
			? join('..', encodeForURI(assignment.getID()), 'students', encodeURIComponent(user))
			: join('..', encodeForURI(assignment.getID()))
		) + (GOTO_HASH[type] || '');

	const titleMarkup = ReactDOMServer.renderToStaticMarkup(<span className="assignment-name">{title}</span>);
	const getLabelWithUser = (data) => t(type, {...data, title: titleMarkup});

	return (
		<div className={cx('item', {unread})}>
			<a href={href}>
				<DateTime date={date} format={format}/>
				{hasName(type) ? (
					<DisplayName entity={feedbackAuthor || user} usePronoun localeKey={getLabelWithUser}/>
				) : (
					<span {...rawContent(t(type, {title: titleMarkup}))}/>
				)}
			</a>
		</div>
	);
}
