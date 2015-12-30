import React from 'react';

import {PropType as NTIID} from 'nti-lib-interfaces/lib/utils/ntiids';

import ItemChanges from 'common/mixins/ItemChanges';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

export default React.createClass({
	displayName: 'GradeBox',
	mixins: [AssignmentsAccessor, ItemChanges],

	propTypes: {
		grade: React.PropTypes.object,

		userId: React.PropTypes.string.isRequired,

		assignmentId: NTIID
	},

	getItem (props = this.props) { return props.grade; },

	onFocus (e) {
		e.target.select();
	},

	onBlur (e) {
		const value = e.target.value.trim();
		const grade = this.getItem() || {value: ''};

		if (grade.value !== value) {
			this.gradeChanged(value);
		}
	},

	componentWillReceiveProps (nextProps) {
		if (!this.props.grade && nextProps.grade) {
			console.log('Got new Grade!', nextProps.grade.value);
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
