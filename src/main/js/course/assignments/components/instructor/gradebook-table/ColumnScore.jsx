import React from 'react';

export default React.createClass({
	displayName: 'GradebookColumnScore',

	statics: {
		label () {
			return 'Score';
		},
		sort: 'Grade'
	},

	propTypes: {
		item: React.PropTypes.object.isRequired // UserGradeBookSummary object
	},


	render () {
		const {props: {item: {HistoryItemSummary}}} = this;
		return (
			<div>{
					HistoryItemSummary && <div>{HistoryItemSummary.grade.value}</div>
				}</div>
		);
	}
});
