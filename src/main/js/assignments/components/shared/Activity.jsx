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
		if (this.unsubscribe) {
			this.unsubscribe();
		}

		if(activity && activity.markSeen) {
			activity.markSeen();
		}
	},

	componentReceivedAssignments (assignments = this.getAssignments()) {
		assignments.getActivity()
			.catch(error => this.setState({ error }))
			.then(activity => this.setState({ activity }));
	},


	componentDidUpdate (_, prevState) {
		const {activity} = this.state;

		const changed = () => this.forceUpdate();

		if (prevState.activity !== activity) {

			if (this.unsubscribe) {
				this.unsubscribe();
			}

			if (activity && activity.addListener) {
				activity.addListener('change', changed);
				this.unsubscribe = ()=> activity.removeListener('change', changed);
			}
		}
	},


	render () {

		const {error, activity} = this.state;

		if (error === 'Not Implemented') {
			return <Notice >Coming Soon</Notice>;
		}

		if (!activity || activity.loading) {
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
