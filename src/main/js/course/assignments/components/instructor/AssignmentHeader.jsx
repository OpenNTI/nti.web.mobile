import React from 'react';

import DateTime from 'common/components/DateTime';

import FilterMenu from './FilterMenu';

export default React.createClass({
	displayName: 'instructor:AssignmentHeader',

	propTypes: {
		assignment: React.PropTypes.object.isRequired
	},

	render () {

		const {assignment} = this.props;

		return (
			<div className="gradebook-assignment-header">
				<div className="gradebook-assignment-title">{assignment.title}</div>
				<DateTime date={assignment.getDueDate()}/>
				<FilterMenu />
			</div>
		);
	}
});
