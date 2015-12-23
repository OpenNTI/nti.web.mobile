import {PropTypes} from 'react';

export default {

	contextTypes: {
		assignments: PropTypes.object,
		course: PropTypes.object
	},

	getCourse () {
		return this.context.course;
	},

	getAssignments () {
		return this.context.assignments;
	},

	componentWillMount () {
		const {assignments} = this.context;
		if (this.componentReceivedAssignments) {
			this.componentReceivedAssignments(assignments);
		}
	},

	componentWillReceiveProps (_,__, context) {
		const {assignments} = context;
		if (this.componentReceivedAssignments && assignments !== this.context.assignments) {
			this.componentReceivedAssignments(assignments);
		}
	}
};
