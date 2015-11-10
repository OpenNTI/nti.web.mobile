import React from 'react';
import cx from 'classnames';

import {HISTORY_LINK} from 'nti.lib.interfaces/models/assessment/Constants';
import PageSource from 'nti.lib.interfaces/models/ListBackedPageSource';

import EmptyList from 'common/components/EmptyList';

import SearchSortStore from '../../SearchSortStore';

import PerformanceItem from './PerformanceItem';

const columns = [
	{
		className: 'completed',
		label: '√',
		sortOn: ['completed', 'title']
	},
	{
		className: 'assignment-title',
		label: 'Assignment Name',
		sortOn: ['title', 'due']

	},
	{
		className: 'assigned',
		label: 'Assigned',
		sortOn: ['assigned','due', 'title']
	},
	{
		className: 'due',
		label: 'Due',
		sortOn: ['due','assigned', 'title']
	},
	{
		className: 'score',
		label: 'Score',
		sortOn: ['score', 'due']
	}
];

export default React.createClass({
	displayName: 'PerformanceListView',

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			sortOn: ['due'],
			sortDesc: false,
			assignments: []
		};
	},

	componentWillMount () {
		this.loadHistory();
		this.sortOn(this.state.sortOn);
	},

	loadHistory ({assignments} = this.props) {
		if(!assignments || !assignments.getHistory) {
			return Promise.reject('No assignments.getHistory?');
		}
		assignments.getHistory()
			.then(history => {
				console.log(history);

				Object.assign(SearchSortStore, {history});
				this.forceUpdate();
			},
			e => {

				console.log(e);
			});
	},

	sortOn (cols) {
		let {sortOn, sortDesc} = this.state;
		if(cols[0] === sortOn[0]) {
			sortDesc = !sortDesc;
		}
		this.setState({
			sortOn: cols,
			sortDesc
		});
		let {assignments} = this.props;
		let items = assignments.getAssignments();
		items.sort((a, b) => compare(a, b, cols.slice()));

		if(sortDesc) {
			items.reverse();
		}

		SearchSortStore.assignmentsList = {
			items: items,
			pageSource: new PageSource(items, 'performance')
		};
	},

	render () {
		let {assignmentsList, history} = SearchSortStore;
		let {sortOn, sortDesc} = this.state;

		const getHistory = x => history && history.getItem(x.getID());

		if(assignmentsList.items.length === 0) {
			return <EmptyList type="assignments"/>;
		}

		return (
			<div className="performance">
				<div className="performance-headings">
					{columns.map((col, index) => {
						let sorted = sortOn[0] === col.sortOn[0];
						let classes = cx(col.className, {
							sorted,
							'desc': sorted && sortDesc,
							'asc': sorted && !sortDesc
						});
						return <div key={index} className={classes} onClick={this.sortOn.bind(this, col.sortOn)}>{col.label}</div>;
					})}
				</div>
				{assignmentsList.items.map(assignment => <PerformanceItem key={assignment.getID()} assignment={assignment} history={getHistory(assignment)} sortedOn={sortOn[0]} />)}
			</div>
		);
	}
});

const getSortProp = {
	'completed': (a) => a.hasLink(HISTORY_LINK),
	'due': (a) => a.getDueDate && a.getDueDate(),
	'assigned': (a) => a.getAssignedDate && a.getAssignedDate(),
	'score': (a) => {
		let {history} = SearchSortStore;
		if (!history) {
			return -2;
		}
		let itemHistory = history.getItem(a.getID());
		let grade = itemHistory && itemHistory.getGradeValue() || -1;
		return parseFloat(grade, 10) || grade;
	}
};

function compare (a, b, props) {
	let property = props.shift();
	let propA = getSortProp[property] ? getSortProp[property](a) : a[property];
	let propB = getSortProp[property] ? getSortProp[property](b) : b[property];
	if( propA > propB ) {
		return 1;
	}
	if( propA < propB ) {
		return -1;
	}
	if(props.length > 0) {
		return compare(a, b, props);
	}
	return 0;
}
