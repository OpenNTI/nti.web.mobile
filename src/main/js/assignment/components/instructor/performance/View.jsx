import React from 'react';

import createReactClass from 'create-react-class';

import ContextSender from 'common/mixins/ContextSender';
import {Mixins} from 'nti-web-commons';

import FilterSearchBar from './FilterSearchBar';
import SummaryTable from './SummaryTable';

import AssignmentsAccessor from '../../../mixins/AssignmentCollectionAccessor';

export default createReactClass({
	displayName: 'Performance',
	mixins: [AssignmentsAccessor, ContextSender, Mixins.NavigatableMixin],


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
