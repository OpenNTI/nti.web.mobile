import React from 'react';
import AssignmentsList from './AssignmentsList';
import SortBox from './SortBox';


export default React.createClass({
	displayName: 'Assignments',

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		course: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	onSortChange (value) {
		this.setState({
			sortBy: value
		});
	},

	onSearchChange (event) {
		this.setState({
			search: event.target.value
		});
	},

	render () {
		const {props: {course, assignments}, state: {sortBy, search}} = this;
		return (
			<div className="assignments-view">
				<div className="search-sort-bar">
					<SortBox assignments={assignments} onChange={this.onSortChange} />
					<input type="search" placeholder="Search Assignments" onChange={this.onSearchChange} />
				</div>
				<AssignmentsList sort={sortBy} search={search} course={course} assignments={assignments} />
			</div>
		);
	}
});
