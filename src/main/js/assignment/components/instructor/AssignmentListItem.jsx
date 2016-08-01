import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

import {encodeForURI} from 'nti-lib-ntiids';

import AssignmentStatusLabel from 'assessment/components/AssignmentStatusLabel';

import CompletionRatio from './CompletionRatio';
import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

const DEFAULT_TEXT = {
	emptyTitle: '(No Title)'
};

const t = scoped('EMPTY_ASSIGNMENT_LIST_ITEM', DEFAULT_TEXT);

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
					<div className="title">{assignment.title || t('emptyTitle')}</div>
					<AssignmentStatusLabel assignment={assignment} />
				</div>
				<CompletionRatio course={this.getCourse()} assignment={assignment} />
			</a>
		);
	}
});
