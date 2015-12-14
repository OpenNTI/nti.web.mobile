import React from 'react';

import {setGrade} from '../../GradebookActions';

export default React.createClass({
	displayName: 'GradeBox',

	propTypes: {
		initialValue: React.PropTypes.string,
		assignmentId: React.PropTypes.string.isRequired,
		userId: React.PropTypes.string.isRequired
	},

	onFocus (e) {
		e.target.select();
	},

	onBlur (e) {
		const {value} = e.target;
		if (this.props.initialValue !== value) {
			this.gradeChanged(value);
		}
	},

	gradeChanged (newValue) {
		setGrade(this.props.assignmentId, this.props.userId, newValue);
	},

	render () {
		return (
			<input className="grade-box"
					defaultValue={this.props.initialValue}
					onBlur={this.onBlur}
					onFocus={this.onFocus}
				/>
		);
	}
});
