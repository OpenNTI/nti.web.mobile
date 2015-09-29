import React from 'react';
import PerformanceItem from './PerformanceItem';
import cx from 'classnames';
import SearchSortStore from '../../SearchSortStore';
import ListBackedPageSource from 'nti.lib.interfaces/models/ListBackedPageSource';

const columns = [
	{
		className: 'completed',
		label: '√',
		sortOn: ['completed', 'title']
	},
	{
		className: 'assignment-title',
		label: 'Assignment Name',
		sortOn: ['title', 'available_for_submission_ending']

	},
	{
		className: 'assigned',
		label: 'Assigned',
		sortOn: ['available_for_submission_beginning','available_for_submission_ending', 'title']
	},
	{
		className: 'due',
		label: 'Due',
		sortOn: ['available_for_submission_ending','available_for_submission_beginning', 'title']
	},
	{
		className: 'score',
		label: 'Score',
		sortOn: ['score', 'available_for_submission_ending']
	}
];

export default React.createClass({
	displayName: 'PerformanceListView',

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			sortOn: ['available_for_submission_ending'],
			sortDesc: true,
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
				SearchSortStore.history = history;
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
			pageSource: new ListBackedPageSource(items)
		};
	},

	render () {
		let {assignmentsList} = SearchSortStore;
		let {sortOn, sortDesc} = this.state;
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
				{assignmentsList.items.map(assignment => <PerformanceItem key={assignment.getID()} assignment={assignment} sortedOn={sortOn[0]} />)}
			</div>
		);
	}
});

const getProp = {
	'completed': (a) => a.hasLink('History'),
	'available_for_submission_ending': (a) => a.getDueDate && a.getDueDate(),
	'available_for_submission_beginning': (a) => a.getAssignedDate && a.getAssignedDate(),
	'score': (a) => {
		let {history} = SearchSortStore;
		if (!history) {
			return '';
		}
		let itemHistory = history.getItem(a.getID());
		return itemHistory && itemHistory.getGradeValue() || null;
	}
};

function compare (a, b, props) {
	let property = props.shift();
	let propA = getProp[property] ? getProp[property](a) : a[property];
	let propB = getProp[property] ? getProp[property](b) : b[property];
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
