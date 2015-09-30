import React from 'react';
import SearchSortBar from './SearchSortBar';
import SearchSortStore from '../SearchSortStore';
import AssignmentsList from './AssignmentsList';

export default React.createClass({
	displayName: 'AssignmentsListView',

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		course: React.PropTypes.object.isRequired
	},

	render () {

		const {course, assignments} = this.props;
		const {search, sort} = SearchSortStore;

		return (
			<div className="assignments-view">
				<SearchSortBar assignments={assignments} />
				<AssignmentsList sort={sort} search={search} course={course} assignments={assignments} />
			</div>
		);
	}
});
