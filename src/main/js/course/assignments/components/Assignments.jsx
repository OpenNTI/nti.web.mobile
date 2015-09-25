import React from 'react';
import AssignmentsList from './AssignmentsList';
import SearchSortBar from './SearchSortBar';
import SearchSortStore from '../SearchSortStore';
import Content from './Content';

export default React.createClass({
	displayName: 'Assignments',

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		course: React.PropTypes.object.isRequired,
		rootId: React.PropTypes.string // assignmentId, present when viewing an individual assignment
	},

	componentDidMount () {
		SearchSortStore.addChangeListener(this.onStoreChanged);
	},

	componentWillUnmount () {
		SearchSortStore.removeChangeListener(this.onStoreChanged);
	},

	onStoreChanged () {
		this.forceUpdate();
	},

	render () {
		const {course, assignments, rootId} = this.props;
		const {search, sort, assignmentsList} = SearchSortStore;
		return rootId ? <Content {...this.props} pageSource={(assignmentsList || {}).pageSource} /> : (
			<div className="assignments-view">
				<SearchSortBar assignments={assignments} />
				<AssignmentsList sort={sort} search={search} course={course} assignments={assignments} />
			</div>
		);
	}
});
