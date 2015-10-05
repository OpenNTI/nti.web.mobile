import React from 'react';
import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'AssignmentFooter',

	propTypes: {
		assignment: React.PropTypes.object.isRequired,
		history: React.PropTypes.object,
		dateFormat: React.PropTypes.string
	},

	getDefaultProps () {
		return {
			dateFormat: 'dddd, MMMM D'
		};
	},

	render () {

		let {assignment, history} = this.props;
		let completed = !!history;
		let graded = !!(history && history.getGradeValue());

		return (
			<div className="footer">
				{completed
					? graded ? 'Graded' : 'Completed'
					: <div>Due&nbsp;<DateTime date={assignment.getAvailableForSubmissionEnding()} format={this.props.dateFormat}/></div>
				}
			</div>
		);
	}
});
