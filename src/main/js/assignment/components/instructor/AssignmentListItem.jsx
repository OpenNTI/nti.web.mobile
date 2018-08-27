import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {encodeForURI} from '@nti/lib-ntiids';

import AssignmentStatusLabel from 'assessment/components/AssignmentStatusLabel';

import Assignments from '../bindings/Assignments';
import TotalPointsLabel from '../shared/TotalPointsLabel';

import CompletionRatio from './CompletionRatio';

const DEFAULT_TEXT = {
	emptyTitle: '(No Title)'
};

const t = scoped('assessment.assignments.list.item', DEFAULT_TEXT);

export default
@Assignments.connect
class AssignmentItem extends React.Component {

	static propTypes = {
		assignment: PropTypes.object.isRequired,
		course: PropTypes.object.isRequired
	}

	render () {
		const {props: {assignment, course}} = this;
		const late = assignment && !assignment.isNonSubmit() && assignment.isLate(new Date());
		const classes = cx('assignment-item', { complete: assignment.hasSubmission, late });

		const href = assignment.hasLink('GradeBookByAssignment')
			? `./${encodeForURI(assignment.getID())}/students/`
			: `./${encodeForURI(assignment.getID())}/`;

		return (
			<a className={classes} href={href}>
				<div>
					<div className="title">
						{assignment.title || t('emptyTitle')}
						<TotalPointsLabel assignment={assignment}/>
					</div>
					<AssignmentStatusLabel assignment={assignment} />
				</div>
				<CompletionRatio course={course} assignment={assignment} />
			</a>
		);
	}
}
