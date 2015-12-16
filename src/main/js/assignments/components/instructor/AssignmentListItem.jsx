import React from 'react';
import cx from 'classnames';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import {HISTORY_LINK} from 'nti.lib.interfaces/models/assessment/Constants';

import AssignmentStatusLabel from 'assessment/components/AssignmentStatusLabel';

import CompletionRatio from './CompletionRatio';

export default React.createClass({
	displayName: 'AssignmentItem',

	propTypes: {
		assignment: React.PropTypes.object.isRequired,
		course: React.PropTypes.object.isRequired
	},

	render () {
		let {assignment, course} = this.props;
		let late = assignment && !assignment.isNonSubmit() && assignment.isLate(new Date());
		let classes = cx('assignment-item', {
			complete: assignment.hasLink(HISTORY_LINK),
			late
		});
		return (
			<a className={classes} href={`./${encodeForURI(assignment.getID())}/students/`}>
				<div>
					{assignment.title}
					<AssignmentStatusLabel assignment={assignment} />
				</div>
				<CompletionRatio course={course} assignment={assignment} />
			</a>
		);
	}
});
