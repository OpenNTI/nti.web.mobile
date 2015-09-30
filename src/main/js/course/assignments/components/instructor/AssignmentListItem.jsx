import React from 'react';
import AssignmentStatusLabel from 'assessment/components/AssignmentStatusLabel';
import CompletionRatio from './CompletionRatio';
import cx from 'classnames';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

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
			complete: assignment.hasLink('History'),
			late
		});
		return (
			<a className={classes} href={`./${encodeForURI(assignment.getID())}/`}>
				<div>
					{assignment.title}
					<AssignmentStatusLabel assignment={assignment} />
				</div>
				<CompletionRatio course={course} assignment={assignment} />
			</a>
		);
	}
});
