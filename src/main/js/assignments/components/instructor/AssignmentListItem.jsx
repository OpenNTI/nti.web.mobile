import React from 'react';
import cx from 'classnames';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import AssignmentStatusLabel from 'assessment/components/AssignmentStatusLabel';

import CompletionRatio from './CompletionRatio';
import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

export default React.createClass({
	displayName: 'AssignmentItem',
	mixins: [AssignmentsAccessor],

	propTypes: {
		assignment: React.PropTypes.object.isRequired
	},

	render () {
		const {props: {assignment}} = this;
		const late = assignment && !assignment.isNonSubmit() && assignment.isLate(new Date());
		const classes = cx('assignment-item', { complete: assignment.hasSubmission, late });
		return (
			<a className={classes} href={`./${encodeForURI(assignment.getID())}/students/`}>
				<div>
					{assignment.title}
					<AssignmentStatusLabel assignment={assignment} />
				</div>
				<CompletionRatio course={this.getCourse()} assignment={assignment} />
			</a>
		);
	}
});
