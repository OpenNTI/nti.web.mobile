import React from 'react';

export default React.createClass({
	displayName: 'CompletionRatio',

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},

	render () {

		const {assignments} = this.props;

		if (!assignments) {
			return null;
		}
		const a = assignments.getAssignments();
		const denominator = a.length;
		const numerator = a.filter(as => as.hasSubmission).length;

		return (
			<span>{numerator} of {denominator}</span>
		);
	}
});
