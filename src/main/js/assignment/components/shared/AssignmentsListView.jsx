import './AssignmentsListView.scss';

import { Component as ContextSender } from 'internal/common/mixins/ContextSender';

import AssignmentsList from './AssignmentsList';
import SearchSortBar from './SearchSortBar';

export default function AssignmentsListView() {
	return (
		<ContextSender>
			<div className="assignments-view">
				<SearchSortBar />
				<AssignmentsList />
			</div>
		</ContextSender>
	);
}
