import './Activity.scss';
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {decorate} from '@nti/lib-commons';
import {
	EmptyList,
	Error,
	Loading,
	ScrollTrigger,
	HOC
} from '@nti/web-commons';

import {Component as ContextSender} from 'common/mixins/ContextSender';

import Assignments from '../bindings/Assignments';

import AssignmentActivityItem from './AssignmentActivityItem';

const Child = ({children}) => children;

class Activity extends React.Component {
	static propTypes = {
		assignments: PropTypes.object.isRequired
	}

	state = {}


	componentDidMount () {
		this.loadActivity();
	}


	componentDidUpdate (prevProps) {
		if (this.props.assignments !== prevProps.assignments) {
			this.loadActivity();
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
		const {activity: item} = this.state;
		const Wrapper = (item && item.addListener) ? HOC.ItemChanges : Child;

		return (
			<Wrapper item={item} onItemChanged={this.onActivityChanged}>
				<div className="assignments-activity">
					<ContextSender/>
					{this.renderContent()}
				</div>
			</Wrapper>
		);
	}


	renderContent () {

		const {error, activity} = this.state;

		if (error || (activity && activity.error)) {
			return <Error error={error || 'There was an error loading activity.'}/>;
		}

		if (!activity || activity.loading) {
			return <Loading.Mask />;
		}

		if (activity.length === 0) {
			//TODO: update empty list with label & sublabel props instead of a type.
			return <EmptyList type="activity" />;
		}

		return (
			<Fragment>
				{activity.map((event, index) =>
					<AssignmentActivityItem key={`activity-item-${index}`} event={event} />
				)}

				{activity.more && !activity.loading && (
					<a className="more" href="#" onClick={this.loadMore}>More</a>
				)}

				<ScrollTrigger onEnterView={this.loadMore} />
			</Fragment>
		);
	}
}


export default decorate(Activity, [
	Assignments.connect
]);
