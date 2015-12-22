import React from 'react';

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
		console.log('Set Grade: %s %s %s', this.props.assignmentId, this.props.userId, newValue);
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
