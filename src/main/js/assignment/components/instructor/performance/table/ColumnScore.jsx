import React from 'react';

import GradeBox from '../../GradeBox';

export default React.createClass({
	displayName: 'performance:ColumnScore',

	statics: {
		label () {
			return 'Score';
		},
		className: 'col-score',
		sort: 'grade'
	},

	propTypes: {
		item: React.PropTypes.object.isRequired,
		userId: React.PropTypes.string.isRequired
	},

	render () {

		const {item, userId} = this.props;
		const {grade, assignmentId} = item;

		return (
			<div>
				<GradeBox assignmentId={assignmentId} userId={userId} grade={grade} />
			</div>
		);
	}
});