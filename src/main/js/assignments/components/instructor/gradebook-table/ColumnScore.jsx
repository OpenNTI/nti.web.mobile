import React from 'react';

import GradeBox from '../GradeBox';

export default React.createClass({
	displayName: 'GradebookColumnScore',

	statics: {
		label () {
			return 'Score';
		},
		className: 'col-score',
		sort: 'Grade'
	},

	propTypes: {
		item: React.PropTypes.object.isRequired, // UserGradeBookSummary object
		assignmentId: React.PropTypes.string.isRequired
	},

	render () {

		const {props: {item: {HistoryItemSummary}}} = this;
		const {grade} = HistoryItemSummary || {};

		return (
			<div>
				<GradeBox
					grade={grade}
					assignmentId={this.props.assignmentId}
					userId={this.props.item.user.getID()}
				/>
			</div>
		);
	}
});
