import React from 'react';

export default React.createClass({
	displayName: 'GradebookColumnFeedback',

	statics: {
		label () {
			return 'Feedback';
		},
		className: 'col-feedback',
		sort: 'feedbackCount'
	},

	propTypes: {
		item: React.PropTypes.object.isRequired // UserGradeBookSummary object
	},

	render () {

		const {props: {item: {HistoryItemSummary}}} = this;

		return (
			<div>{HistoryItemSummary && HistoryItemSummary.FeedbackCount > 0 && HistoryItemSummary.FeedbackCount}</div>
		);
	}
});
