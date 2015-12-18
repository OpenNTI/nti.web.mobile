import React from 'react';

import Loading from 'common/components/Loading';
import EmptyList from 'common/components/EmptyList';

import SearchSortStore from '../../SearchSortStore';

import AssignmentGroup from './AssignmentGroup';

export default React.createClass({
	displayName: 'AssignmentsList',

	propTypes: {
		course: React.PropTypes.object.isRequired,
		sort: React.PropTypes.any,
		search: React.PropTypes.string,
		assignments: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
		};
	},

	componentWillMount () {
		this.getAssignments();
	},

	componentWillReceiveProps (nextProps) {
		if(this.props.sort !== nextProps.sort || this.props.search !== nextProps.search) {
			this.getAssignments(nextProps);
		}
	},

	getAssignments (props = this.props) {
		let {assignments, sort = assignments.ORDER_BY_DUE_DATE, search} = props;

		this.setState({
			loading: true
		});

		assignments.getAssignmentsBy(sort, search)
			.then(sorted => {
				SearchSortStore.assignmentsList = sorted;
				this.setState({ loading: false });
			});
	},

	render () {
		const {props: {course}, state: {loading}} = this;
		const {assignmentsList} = SearchSortStore;

		if(loading || !assignmentsList) {
			return <Loading />;
		}

		if(assignmentsList.items.length === 0) {
			return <EmptyList type="assignments" />;
		}

		return (
			<ul className="assignments-list">
				{assignmentsList.items.map((group, index) => (
					<li key={index}>
						<AssignmentGroup group={group} course={course} />
					</li>
				))}
			</ul>
		);
	}
});
