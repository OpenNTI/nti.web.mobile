import React from 'react';
import createReactClass from 'create-react-class';
import cx from 'classnames';
import {SortOrder} from 'nti-lib-interfaces';
import {EmptyList, Mixins} from 'nti-web-commons';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

import PerformanceHeader from './PerformanceHeader';
import PerformanceItem from './PerformanceItem';
import PerformanceListViewHeading from './PerformanceListViewHeading';


const columns = [
	{
		className: 'completed',
		label: '√',
		sortOn: 'completed'
	},
	{
		className: 'assignment-title',
		label: 'Assignment Name',
		sortOn: 'title'
	},
	{
		className: 'assigned',
		label: 'Assigned',
		sortOn: 'assignedDate'
	},
	{
		className: 'due',
		label: 'Due',
		sortOn: 'dueDate'
	},
	{
		className: 'score',
		label: 'Score',
		sortOn: 'grade'
	}
];

export default createReactClass({
	displayName: 'PerformanceListView',
	mixins: [AssignmentsAccessor, Mixins.ItemChanges],

	componentWillMount () {
		this.setState({ summary: this.getAssignments().getStudentSummary() });
	},


	getItem () { //getItem is for the mixin
		return this.state.summary;
	},


	changeSort (column) {
		const {ASC, DESC} = SortOrder;
		const {state: {summary}} = this;
		const {sortOn, sortOrder} = summary.getSort();

		const direction = (sortOn !== column || sortOrder === DESC) ? ASC : DESC;

		summary.setSort(column, direction);
	},


	render () {
		const {state: {summary}} = this;
		const {sortOn, sortOrder} = summary.getSort();
		const assignments = this.getAssignments();

		if(summary.length === 0) {
			return <EmptyList type="assignments"/>;
		}

		return (
			<div className="performance">
				<PerformanceHeader assignments={assignments}/>
				<div className="performance-headings">
					{columns.map((col, index) => {
						const sorted = sortOn === col.sortOn;
						const classes = cx(col.className, {
							sorted,
							'desc': sorted && sortOrder === SortOrder.DESC,
							'asc': sorted && sortOrder === SortOrder.ASC
						});
						return (
							<PerformanceListViewHeading key={index} column={col} className={classes} onClick={this.changeSort} />
						);
					})}
				</div>
				{summary.map(item => <PerformanceItem key={item.assignmentId} item={item} sortedOn={sortOn} />)}
			</div>
		);
	}
});
