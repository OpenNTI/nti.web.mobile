import React from 'react';
import cx from 'classnames';

import {encodeForURI} from 'nti-lib-ntiids';

import {DateTime} from 'nti-web-commons';
import DisplayName from 'common/components/DisplayName';

import {scoped} from 'nti-lib-locale';

import {join} from 'path';

const scope = 'COURSE.ASSIGNMENTS.ACTIVITY';
const t = scoped(scope);

const hasName = RegExp.prototype.test.bind(/^(user|they)/i);

const linkToStudentView = (user, type) => user && hasName(type);

const GOTO_HASH = {
	'they-feedback': '#feedback',
	'you-feedback': '#feedback'
};

ActivityItem.propTypes = {
	event: React.PropTypes.object.isRequired
};

ActivityItem.contextTypes = {
	isInstructor: React.PropTypes.bool
};

export default function ActivityItem ({event}, {isInstructor}) {
	const {date, title, type, suffix, unread, user, assignment} = event;
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

	return (
		<div className={cx('item', {unread})}>
			<DateTime date={date} format={format}/>
			{hasName(type) ? (
				<DisplayName entity={user} usePronoun localeKey={`${scope}.${type}`}/>
			) : (
				<span className="type">{t(type)}</span>
			)}
			<a href={href}><span className="assignment-name">{title}</span></a>
			{suffix && (
				<div>
					<span className="label suffix">{suffix}</span>
				</div>
			)}
		</div>
	);
}
