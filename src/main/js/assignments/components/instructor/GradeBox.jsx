import React from 'react';

import ItemChanges from 'common/mixins/ItemChanges';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

export default React.createClass({
	displayName: 'GradeBox',
	mixins: [AssignmentsAccessor, ItemChanges],

	propTypes: {
		grade: React.PropTypes.object,
		assignmentId: React.PropTypes.string.isRequired,
		userId: React.PropTypes.string.isRequired
	},

	getItem (props = this.props) { return props.grade; },

	onFocus (e) {
		e.target.select();
	},

	onBlur (e) {
		const {value} = e.target;
		const grade = this.getItem();
		if (!grade || grade.value !== value) {
			this.gradeChanged(value);
		}
	},

	gradeChanged (newValue) {
		const {assignmentId, userId, grade} = this.props;
		const collection = this.getAssignments();


		collection.setGrade(grade || assignmentId, userId, newValue)
			.then(
				( ) => console.log('Success'),
				(e) => console.error( e ? (e.stack || e.message || e) : 'Error')
			);
	},

	render () {
		const {value} = this.getItem() || {};
		return (
			<input className="grade-box"
					defaultValue={value}
					onBlur={this.onBlur}
					onFocus={this.onFocus}
				/>
		);
	}
});
