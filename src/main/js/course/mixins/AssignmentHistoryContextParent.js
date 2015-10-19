import React from 'react';

const noHistory = {
	getItem: () => null
};

export default {

	childContextTypes: {
		assignmentsHistory: React.PropTypes.object
	},

	getChildContext () {
		return {
			assignmentsHistory: this.state.assignmentsHistory
		};
	},

	componentDidMount () {
		this.loadAssignmentHistory();
	},

	loadAssignmentHistory () {
		let {course} = this.props;
		course.getAssignments()
			.then(assignments => assignments.getHistory ? assignments.getHistory() : noHistory)
			.then(assignmentsHistory => {
				this.setState({
					assignmentsHistory
				});
			});
	}

};
