import React from 'react';
import cx from 'classnames';

import {SortOrder} from 'nti.lib.interfaces/constants';

import EmptyList from 'common/components/EmptyList';

import ItemChanges from 'common/mixins/ItemChanges';

import PerformanceItem from './PerformanceItem';

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

export default React.createClass({
	displayName: 'PerformanceListView',
	mixins: [ItemChanges],

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},

	componentWillMount () {
		const {props: {assignments}} = this;
		this.setState({ summary: assignments.getStudentSummary() });
	},


	getItem () { //getItem is for the mixin
		return this.state.summary;
	},


	changSort (column) {
		const {ASC, DESC} = SortOrder;
		const {state: {summary}} = this;
		const {sortOn, sortOrder} = summary.getSort();

		const direction = (sortOn !== column || sortOrder === DESC) ? ASC : DESC;

		summary.setSort(column, direction);
	},


	render () {
		const {props: {assignments}, state: {summary}} = this;
		const {sortOn, sortOrder} = summary.getSort();

		if(assignments.length === 0) {
			return <EmptyList type="assignments"/>;
		}

		return (
			<div className="performance">
				<div className="performance-headings">
					{columns.map((col, index) => {
						const sorted = sortOn === col.sortOn;
						const classes = cx(col.className, {
							sorted,
							'desc': sorted && sortOrder === SortOrder.DESC,
							'asc': sorted && sortOrder === SortOrder.ASC
						});
						return (
							<div key={index} className={classes} onClick={()=>this.changSort(col.sortOn)}>
								{col.label}
							</div>
						);
					})}
				</div>
				{summary.map(item => <PerformanceItem key={item.assignmentId} item={item} sortedOn={sortOn} />)}
			</div>
		);
	}
});
