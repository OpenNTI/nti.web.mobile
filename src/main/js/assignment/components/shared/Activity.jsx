import React from 'react';

import {
	EmptyList,
	Loading,
	Notice,
	ScrollTrigger,
	TinyLoader
} from 'nti-web-commons';

import ContextSender from 'common/mixins/ContextSender';

import AssignmentActivityItem from './AssignmentActivityItem';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';


export default React.createClass({
	displayName: 'Activity',
	mixins: [AssignmentsAccessor, ContextSender],

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
			.catch(error => (this.setState({ error }), []))
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


	loadMore (e) {
		if(e) {
			e.preventDefault();
			e.stopPropagation();
		}


		const store = this.state.activity || {};

		if (store.more && store.nextBatch) {
			store.nextBatch();
		}
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
				{activity.loading && (
					<TinyLoader />
				)}
				{activity.more && !activity.loading && (
					<a className="more" href="#" onClick={this.loadMore}>More</a>
				)}

				<ScrollTrigger onEnterView={this.loadMore} />
			</div>
		);
	}
});
