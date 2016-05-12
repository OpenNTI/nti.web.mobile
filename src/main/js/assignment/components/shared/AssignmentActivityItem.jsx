import React from 'react';
import cx from 'classnames';

import {encodeForURI} from 'nti-lib-ntiids';

import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';

import {scoped} from 'common/locale';

import {join} from 'path';

const scope = 'COURSE.ASSIGNMENTS.ACTIVITY';
const t = scoped(scope);

const hasName = RegExp.prototype.test.bind(/^(user|they)/i);

const linkToStudentView = (user, type) => user && hasName(type);

export default function ActivityItem ({event}) {
	const {date, title, type, suffix, unread, user, assignment} = event;
	const today = new Date((new Date()).setHours(0, 0, 0, 0));

	let format = 'MMM D'; // "Jan 2" ... Short month, Day of month without zero padding
	if (date > today) {
		format = 'h:mm a'; // "8:05 pm" ...Hours without zero padding, ":", minutes with zero padding, lower-case "am/pm"
	}

	//TODO: Limit linkToStudentView to only apply IF instructor view...
	//feedback events look the same to both student and instructors... so this breaks feedback for students.
	const href = linkToStudentView(user, type)
		? join('..', encodeForURI(assignment.getID()), 'students', encodeURIComponent(user))
		: join('..', encodeForURI(assignment.getID()));

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

ActivityItem.propTypes = {
	event: React.PropTypes.object.isRequired
};
