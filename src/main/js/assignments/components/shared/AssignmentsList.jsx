import React from 'react';

import Loading from 'common/components/Loading';
import EmptyList from 'common/components/EmptyList';

import AssignmentGroup from './AssignmentGroup';
import AssignmentsAccessor from './AssignmentsAccessor';

export default React.createClass({
	displayName: 'AssignmentsList',
	mixins: [AssignmentsAccessor],

	propTypes: {
		course: React.PropTypes.object.isRequired,
		sort: React.PropTypes.any,
		search: React.PropTypes.string,
		assignments: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	render () {
		const {props: {assignments, course}} = this;

		const store = this.getAssignments();

		if(!store || store.loading) {
			return <Loading />;
		}

		if(store.length === 0) {
			return <EmptyList type="assignments" />;
		}

		return (
			<ul className="assignments-list">
				{store.map((group, index) => (
					<li key={index}>
						<AssignmentGroup group={group} course={course} assignments={assignments} />
					</li>
				))}
			</ul>
		);
	}
});
