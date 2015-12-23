import React from 'react';

export default React.createClass({
	displayName: 'GradeBox',

	propTypes: {
		grade: React.PropTypes.object,
		assignmentId: React.PropTypes.string.isRequired,
		userId: React.PropTypes.string.isRequired
	},

	onFocus (e) {
		e.target.select();
	},

	onBlur (e) {
		const {value} = e.target;
		const {grade} = this.props;
		if (!grade || grade.value !== value) {
			this.gradeChanged(value);
		}
	},

	gradeChanged (newValue) {
		console.log('Set Grade: %s %s %s', this.props.assignmentId, this.props.userId, newValue);
	},

	render () {
		const {props: {grade: {value} = {}}} = this;
		return (
			<input className="grade-box"
					defaultValue={value}
					onBlur={this.onBlur}
					onFocus={this.onFocus}
				/>
		);
	}
});
