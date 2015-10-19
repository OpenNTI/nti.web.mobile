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

		const {assignment, history, dateFormat} = this.props;
		const completed = !!history;
		const graded = !!(history && history.getGradeValue());

		return (
			<div className="footer">
				{completed
					? graded ? 'Graded' : 'Completed'
					: (
						<div>
							{'Due '}
							<DateTime
								date={assignment.getDueDate()}
								format={dateFormat}
								/>
						</div>
				)}
			</div>
		);
	}
});
