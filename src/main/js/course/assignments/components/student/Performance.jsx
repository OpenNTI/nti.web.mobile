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
		this.setState({
			sortOn: cols
		});
	},

	render () {
		let {assignments} = this.props;
		let {sortOn} = this.state;
		let items = assignments.getAssignments();
		items.sort((a, b) => compare(a, b, sortOn.slice()));
		let primarySort = sortOn.length > 0 ? sortOn[0] : 'title';

		return (
			<div className="performance">
				<div className="performance-headings">
					{columns.map(col => {
						let classes = cx(col.className, {'sorted': sortOn[0] === col.sortOn[0]});
						return <div className={classes} onClick={this.sortOn.bind(this, col.sortOn)}>{col.label}</div>;
					})}
				</div>
				{items.map(assignment => <PerformanceItem key={assignment.getID()} assignment={assignment} />)}
			</div>
		);
	}
});

function compare (a, b, props) {
	let property = props.shift();
	if (property === 'completed') {
		if(a.hasLink('History') && !b.hasLink('History')) {
			return -1;
		}
		if(b.hasLink('History') && !a.hasLink('History')) {
			return 1;
		}
		if(props.length > 0) {
			return compare(a, b, props);
		}
		return 0;
	}
	if( a[property] > b[property] ) {
		return 1;
	}
	if( a[property] < b[property] ) {
		return -1;
	}
	if(props.length > 0) {
		return compare(a, b, props);
	}
	return 0;
}
