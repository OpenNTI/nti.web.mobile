import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {SortOrder} from '@nti/lib-interfaces';
import {EmptyList, HOC} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Assignments from '../bindings/Assignments';

import PerformanceHeader from './PerformanceHeader';
import PerformanceItem from './PerformanceItem';
import PerformanceListViewHeading from './PerformanceListViewHeading';


const t = scoped('nti-web-mobile.assignment.components.student.PerformanceListView', {
	assignmentName: 'Assignment Name'
});

const columns = [
	{
		className: 'completed',
		label: '√',
		sortOn: 'completed'
	},
	{
		className: 'assignment-title',
		get label () { return t('assignmentName'); },
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

export default
@Assignments.connect
class PerformanceListView extends React.Component {

	static propTypes = {
		assignments: PropTypes.object.isRequired
	}


	getSummary ({assignments} = this.props) {
		return assignments && assignments.getStudentSummary();
	}


	constructor (props) {
		super(props);
		this.state = { summary: this.getSummary(props) };
	}


	changeSort = (column) => {
		const {ASC, DESC} = SortOrder;
		const {state: {summary}} = this;
		const {sortOn, sortOrder} = summary.getSort();

		const direction = (sortOn !== column || sortOrder === DESC) ? ASC : DESC;

		summary.setSort(column, direction);
	}


	onSummaryUpdated = () => {
		this.forceUpdate();
	}


	render () {
		const {props: {assignments}, state: {summary}} = this;
		const {sortOn, sortOrder} = summary.getSort();

		return (
			<div className="performance">
				<HOC.ItemChanges item={summary} onItemChanged={this.onSummaryUpdated}/>
				{summary.length === 0 ? (

					<EmptyList type="assignments"/>

				) : (

					<React.Fragment>
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

					</React.Fragment>
				)}
			</div>
		);
	}
}
