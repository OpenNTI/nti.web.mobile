import React from 'react';

import Loading from 'common/components/Loading';
import EmptyList from 'common/components/EmptyList';

import AssignmentActivityItem from './AssignmentActivityItem';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

import Notice from 'common/components/Notice';

export default React.createClass({
	displayName: 'Activity',
	mixins: [AssignmentsAccessor],

	getInitialState () {
		return {};
	},


	componentWillUnmount () {
		const {activity} = this.state;
		if(activity && activity.markSeen) {
			activity.markSeen();
		}
	},

	componentReceivedAssignments (assignments = this.getAssignments()) {
		assignments.getActivity()
			.catch(error => this.setState({ error }))
			.then(activity => this.setState({ activity }));
	},


	render () {

		const {error, activity} = this.state;

		if (error === 'Not Implemented') {
			return <Notice >Coming Soon</Notice>;
		}

		if (!activity) {
			return <Loading />;
		}

		if (activity.length === 0) {
			return <EmptyList type="activity" />;
		}

		return (
			<div className="assignments-activity">
				{activity.map((event, index) =>
					<AssignmentActivityItem key={`activity-item-${index}`} event={event} />
				)}
			</div>
		);
	}
});
