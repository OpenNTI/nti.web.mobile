import React from 'react';

import AssignmentsList from './AssignmentsList';
import SearchSortBar from './SearchSortBar';

export default React.createClass({
	displayName: 'AssignmentsListView',

	render () {
		return (
			<div className="assignments-view">
				<SearchSortBar />
				<AssignmentsList />
			</div>
		);
	}
});
