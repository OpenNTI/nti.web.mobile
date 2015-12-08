import React from 'react';
import cx from 'classnames';

import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'GradebookColumnCompleted',

	statics: {
		label () {
			return 'Completed';
		},
		className: 'col-completed',
		sort: 'dateSubmitted'
	},

	propTypes: {
		item: React.PropTypes.object.isRequired, // UserGradeBookSummary object
		assignment: React.PropTypes.object.isRequired
	},

	render () {
		const {props: {item: {HistoryItemSummary}, assignment}} = this;
		const completedTime = HistoryItemSummary && HistoryItemSummary.getSubmissionCreatedTime();
		const classes = cx({
			'complete': !!completedTime,
			'late': completedTime && completedTime > assignment.getDueDate()
		});
		return (
			<div className={classes}>
				{completedTime && <DateTime date={completedTime} format="MM/DD" />}
			</div>
		);
	}
});
