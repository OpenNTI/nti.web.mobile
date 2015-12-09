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
				<PageControls summary={this.props.summary} />
				<div className="gradebook-assignment-title">{assignment.title}</div>
				<div className="meta">
					<DateTime date={assignment.getDueDate()}/>
					<FilterMenu />
				</div>
				<div className="extras">View Assignment</div>
			</div>
		);
	}
});
