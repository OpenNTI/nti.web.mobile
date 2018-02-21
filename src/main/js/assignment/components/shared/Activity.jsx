import React from 'react';
import PropTypes from 'prop-types';
import {
	EmptyList,
	Loading,
	Notice,
	ScrollTrigger,
	HOC
} from 'nti-web-commons';

import {Component as ContextSender} from 'common/mixins/ContextSender';

import Assignments from '../bindings/Assignments';

import AssignmentActivityItem from './AssignmentActivityItem';


export default
@Assignments.connect
class Activity extends React.Component {
	static propTypes = {
		assignments: PropTypes.object.isRequired
	}

	state = {}


	componentDidMount () {
		this.loadActivity();
	}


	componentWillReceiveProps (nextProps) {
		if (this.props.assignments !== nextProps.assignments) {
			this.loadActivity(nextProps);
		}
	}


	componentWillUnmount () {
		const {activity} = this.state;

		if(activity && activity.markSeen) {
			activity.markSeen();
		}
	}


	async loadActivity ({assignments} = this.props) {
		let activity = [];
		try {
			activity = await assignments.getActivity();
		} catch (error) {
			this.setState({ error });
		} finally {
			this.setState({ activity });
		}
	}


	loadMore = (e) => {
		if(e) {
			e.preventDefault();
			e.stopPropagation();
		}


		const store = this.state.activity || {};

		if (store.more && store.nextBatch) {
			store.nextBatch();
		}
	}


	onActivityChanged = () => {
		this.forceUpdate();
	}


	render () {

		const {error, activity} = this.state;

		if (error === 'Not Implemented') {
			return <Notice >Coming Soon</Notice>;
		}

		if (!activity) {
			return <Loading.Mask />;
		}

		if (activity.length === 0) {
			//TODO: update empty list with label & sublabel props instead of a type.
			return <EmptyList type="activity" />;
		}

		return (
			<div className="assignments-activity">
				<ContextSender/>
				{activity && activity.addListener && (
					<HOC.ItemChanges item={activity} onItemChanged={this.onActivityChanged}/>
				)}
				{activity.map((event, index) =>
					<AssignmentActivityItem key={`activity-item-${index}`} event={event} />
				)}
				{activity.loading && (
					<Loading.Ellipse />
				)}
				{activity.more && !activity.loading && (
					<a className="more" href="#" onClick={this.loadMore}>More</a>
				)}

				<ScrollTrigger onEnterView={this.loadMore} />
			</div>
		);
	}
}
