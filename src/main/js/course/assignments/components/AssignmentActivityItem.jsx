import React from 'react';
import cx from 'classnames';
import DateTime from 'common/components/DateTime';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import If from 'common/components/Conditional';
import {scoped} from 'common/locale';
import {join} from 'path';

const t = scoped('COURSE.ASSIGNMENTS.ACTIVITY');

export default React.createClass({
	displayName: 'ActivityItem',

	propTypes: {
		event: React.PropTypes.object.isRequired
	},

	render () {
		const {event} = this.props;
		const {date, title, type, suffix, unread, assignment} = event;
		const today = new Date((new Date()).setHours(0, 0, 0, 0));

		let format = 'MMM D'; // "Jan 2" ... Short month, Day of month without zero padding
		if (date > today) {
			format = 'h:mm a'; // "8:05 pm" ...Hours without zero padding, ":", minutes with zero padding, lower-case "am/pm"
		}

		const href = join('..', encodeForURI(assignment.getID()));

		return (
			<div className={cx('item', {unread})}>
				<DateTime date={date} format={format}/>
				<span className="type">{t(type)}</span>
				<a href={href}><span className="assignment-name">{title}</span></a>
				<If condition={suffix}>
					<span className="label suffix">{suffix}</span>
				</If>
			</div>
		);
	}
});
