import {join} from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {rawContent} from '@nti/lib-commons';
import {encodeForURI} from '@nti/lib-ntiids';
import {DateTime, DisplayName} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

const t = scoped('course.assignments.activity', {
	'grade-received': 'Grade Received:  %(title)s',
	'late-assignment': 'Assignment Past Due:  %(title)s',
	'new-assignment': 'New Assignment:  %(title)s',

	'submitted-assignment': 'Assignment Submitted:  %(title)s',
	'user-submitted-assignment': '%(name)s Submitted Assignment:  %(title)s',

	'they-feedback': '%(name)s left feedback on: %(title)s',
	'you-feedback-theirs': 'You commented on %(title)s (%(name)s)',
	'you-feedback': 'You commented on: %(title)s'
});


const hasName = type => (t(type, {name: type, title: ''}) || '').indexOf(type) >= 0;

const linkToStudentView = (user) => user;

const GOTO_HASH = {
	'they-feedback': '#feedback',
	'you-feedback-theirs': '#feedback',
	'you-feedback': '#feedback'
};

const htmlEncode = str => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const getTitle = e => e && e.title;
const getType = e => e && e.type;

export default class ActivityItem extends React.Component {
	static propTypes = {
		event: PropTypes.object.isRequired
	}

	static contextTypes = {
		isInstructor: PropTypes.bool
	}


	getTitleMarkup = ({event} = this.props) =>
		`<span class="assignment-name">${htmlEncode(getTitle(event))}</span>`


	getLabelWithUser = (data) => t(getType(this.props.event), {...data, title: this.getTitleMarkup()});


	render () {
		const {props: {event}, context: {isInstructor}} = this;
		const {feedbackAuthor, date, type, unread, user, assignment} = event;
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
				<a href={href}>
					<DateTime date={date} format={format}/>
					{hasName(type) ? (
						<DisplayName entity={feedbackAuthor || user} usePronoun localeKey={this.getLabelWithUser}/>
					) : (
						<span {...rawContent(t(type, {title: this.getTitleMarkup()}))}/>
					)}
				</a>
			</div>
		);
	}
}
