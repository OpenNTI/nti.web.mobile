import React from 'react';
import PerformanceItem from './PerformanceItem';
import cx from 'classnames';

const columns = [
	{
		className: 'assignment-title',
		label: 'Assignment',
		sortOn: ['title', 'available_for_submission_ending']

	},
	{
		className: 'assigned',
		label: 'Assigned',
		sortOn: ['available_for_submission_beginning','available_for_submission_ending']

	},
	{
		className: 'due',
		label: 'Due',
		sortOn: ['available_for_submission_ending','available_for_submission_beginning']

	},
	{
		className: 'completed',
		label: 'Completed',
		sortOn: ['completed', 'title']

	},
	{
		className: 'score',
		label: 'Score',
		sortOn: ['score', 'available_for_submission_ending']

	}
];

export default React.createClass({
	displayName: 'Performance',

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			sortOn: ['title'],
			sortDesc: false,
			assignments: []
		};
	},

	getAssignments (props = this.props) {
		let a = props.assignments.getAssignments();
		this.setState({
			assignments: a
		});
	},

	sort () {
		let assignments = this.state.assignments.slice();

		this.setState({
			assignments
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
	},

	render () {
		let {assignments} = this.props;
		let {sortOn, sortDesc} = this.state;
		let items = assignments.getAssignments();
		items.sort((a, b) => compare(a, b, sortOn.slice()));
		if(sortDesc) {
			items.reverse();
		}
		return (
			<div className="performance">
				<div className="performance-headings">
					{columns.map(col => {
						let sorted = sortOn[0] === col.sortOn[0];
						let classes = cx(col.className, {
							sorted,
							'desc': sorted && sortDesc,
							'asc': sorted && !sortDesc
						});
						return <div className={classes} onClick={this.sortOn.bind(this, col.sortOn)}>{col.label}</div>;
					})}
				</div>
				{items.map(assignment => <PerformanceItem key={assignment.getID()} assignment={assignment} sortedOn={sortOn[0]} />)}
			</div>
		);
	}
});

function compare (a, b, props) {
	let property = props.shift();
	let propA = property === 'completed' ? a.hasLink('History') : a[property];
	let propB = property === 'completed' ? b.hasLink('History') : b[property];
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
