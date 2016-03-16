import React from 'react';

import AssignmentsList from './AssignmentsList';
import SearchSortBar from './SearchSortBar';


export default function AssignmentsListView () {
	return (
		<div className="assignments-view">
			<SearchSortBar />
			<AssignmentsList />
		</div>
	);
}
