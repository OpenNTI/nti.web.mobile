import React from 'react';
import cx from 'classnames';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';
import If from 'common/components/Conditional';

import {scoped} from 'common/locale';

import {join} from 'path';

const scope = 'COURSE.ASSIGNMENTS.ACTIVITY';
const t = scoped(scope);

export default React.createClass({
	displayName: 'ActivityItem',

	propTypes: {
		event: React.PropTypes.object.isRequired
	},

	render () {
		const {event} = this.props;
		const {date, title, type, suffix, unread, user, assignment} = event;
		const today = new Date((new Date()).setHours(0, 0, 0, 0));
		const hasName = type === 'they-feedback';

		let format = 'MMM D'; // "Jan 2" ... Short month, Day of month without zero padding
		if (date > today) {
			format = 'h:mm a'; // "8:05 pm" ...Hours without zero padding, ":", minutes with zero padding, lower-case "am/pm"
		}

		const href = join('..', encodeForURI(assignment.getID()));

		return (
			<div className={cx('item', {unread})}>
				<DateTime date={date} format={format}/>
				{hasName ? (
					<DisplayName entity={user} usePronoun localeKey={`${scope}.${type}`}/>
				) : (
					<span className="type">{t(type)}</span>
				)}
				<a href={href}><span className="assignment-name">{title}</span></a>
				<If condition={suffix}>
					<span className="label suffix">{suffix}</span>
				</If>
			</div>
		);
	}
});
