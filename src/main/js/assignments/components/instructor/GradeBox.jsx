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
		console.log('Set Grade: %s %s %s', this.props.assignmentId, this.props.userId, newValue);
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
