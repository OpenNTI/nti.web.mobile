import React from 'react';

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
				<FilterMenu />
			</div>
		);
	}
});
