import React from 'react';

import ContextSender from 'common/mixins/ContextSender';
import Navigatable from 'common/mixins/NavigatableMixin';

import FilterSearchBar from './FilterSearchBar';
import SummaryTable from './SummaryTable';

import AssignmentsAccessor from '../../../mixins/AssignmentCollectionAccessor';

export default React.createClass({
	displayName: 'Performance',
	mixins: [AssignmentsAccessor, ContextSender, Navigatable],


	componentReceivedAssignments (assignments = this.getAssignments()) {
		const summary = assignments.getSummary();
		this.setState({summary});
	},


	getContext () {
		return {
			label: 'Grades & Performance',
			href: this.makeHref('/performance/')
		};
	},


	render () {
		const {summary} = this.state;
		return (
			<div className="performance-view">
				<FilterSearchBar summary={summary} />
				<SummaryTable summary={summary} />
			</div>
		);
	}
});
