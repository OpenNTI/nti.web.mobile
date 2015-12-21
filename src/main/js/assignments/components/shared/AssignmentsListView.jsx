import React from 'react';

import AssignmentsList from './AssignmentsList';
import SearchSortBar from './SearchSortBar';

export default React.createClass({
	displayName: 'AssignmentsListView',

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		course: React.PropTypes.object.isRequired
	},

	render () {
		return (
			<div className="assignments-view">
				<SearchSortBar {...this.props} />
				<AssignmentsList {...this.props} />
			</div>
		);
	}
});
