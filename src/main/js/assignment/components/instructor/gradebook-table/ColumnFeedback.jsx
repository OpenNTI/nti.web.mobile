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

		const {props: {item: {HistoryItemSummary: item}}} = this;

		return (
			<div>{item && item.feedbackCount > 0 && item.feedbackCount}</div>
		);
	}
});
