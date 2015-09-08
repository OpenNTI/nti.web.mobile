import React from 'react';
import PerformanceItem from './PerformanceItem';

export default React.createClass({
	displayName: 'Performance',

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			sortedOn: null,
			assignments: []
		};
	},

	componentDidMount () {
		this.getAssignments();
	},

	componentWillReceiveProps (nextProps) {
		this.getAssignments(nextProps);
	},

	getAssignments (props = this.props) {
		let a = props.assignments.getAssignments();
		this.setState({
			assignments: a
		});
	},

	sort (property, secondary) {
		let assignments = this.state.assignments.slice();
		assignments.sort((a, b) => compare(a, b, property, secondary));
		this.setState({
			assignments
		});

	},

	render () {
		let {assignments} = this.state;
		return (
			<div className="performance">
				<div className="performance-headings">
					<div onClick={this.sort.bind(this, 'title', 'available_for_submission_ending')} className="assignment-title">Assignment</div>
					<div onClick={this.sort.bind(this, 'available_for_submission_beginning','available_for_submission_ending')} className="assigned">Assigned</div>
					<div onClick={this.sort.bind(this, 'available_for_submission_ending','available_for_submission_beginning')} className="due">Due</div>
					<div onClick={this.sort.bind(this, 'completed', 'title')} className="completed">Completed</div>
					<div onClick={this.sort.bind(this, 'score', 'available_for_submission_ending')} className="score">Score</div>
				</div>
				{assignments.map(assignment => <PerformanceItem key={assignment.getID()} assignment={assignment} />)}
			</div>
		);
	}
});

function compare (a, b, property, secondary) {
	if (property === 'completed') {
		if(a.hasLink('History') && !b.hasLink('History')) {
			return -1;
		}
		if(b.hasLink('History') && !a.hasLink('History')) {
			return 1;
		}
		if(secondary) {
			return compare(a, b, secondary);
		}
		return 0;
	}
	if( a[property] > b[property] ) {
		return 1;
	}
	if( a[property] < b[property] ) {
		return -1;
	}
	if(secondary) {
		return compare(a, b, secondary);
	}
	return 0;
}
