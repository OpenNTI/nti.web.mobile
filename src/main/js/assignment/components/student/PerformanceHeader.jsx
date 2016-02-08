import React from 'react';

import FinalGrade from './FinalGrade';
import CompletionRatio from './CompletionRatio';

export default React.createClass({
	displayName: 'PerformanceHeader',

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	componentWillMount () {
		this.getFinalGrade();
	},

	componentWillReceiveProps (nextProps) {
		this.getFinalGrade(nextProps);
	},

	getFinalGrade (props = this.props) {
		const {assignments} = props;
		if (assignments) {
			const id = assignments.getFinalGradeAssignmentId();
			if(id) {
				assignments.getHistoryItem(id)
					.then(historyItem => {
						this.setState({
							grade: historyItem.grade
						});
					});
			}
		}
	},

	render () {

		const {assignments} = this.props;
		const {grade} = this.state;

		return (
			<div className="performance-header">
				<div className="course-grade">
					<span className="label">Course Grade</span>
					<span className="value"><FinalGrade grade={grade}/></span>
				</div>
				<div className="completed-assignments">
					<span className="label">Assignments Completed</span>
					<span className="value"><CompletionRatio assignments={assignments} /></span>
				</div>
			</div>
		);
	}
});