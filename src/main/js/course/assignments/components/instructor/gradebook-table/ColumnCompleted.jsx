import React from 'react';

import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'GradebookColumnCompleted',

	statics: {
		label () {
			return 'Completed';
		},
		className: 'col-completed'
	},

	propTypes: {
		item: React.PropTypes.object.isRequired // UserGradeBookSummary object
	},


	render () {
		const {props: {item: {HistoryItemSummary}}} = this;
		return (
			<div><DateTime date={HistoryItemSummary.getSubmissionCreatedTime()} format="MM/DD" /></div>
		);
	}
});
