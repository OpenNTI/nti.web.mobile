import React from 'react';

import Banner from 'common/components/Banner';
import ScrollTrigger from 'common/components/ScrollTrigger';
import Loading from 'common/components/Loading';
import GradientBackground from 'common/components/GradientBackground';

import ActivityBucket from './ActivityBucket';

import ContextParent from '../mixins/AssignmentHistoryContextParent';

export default React.createClass({
	displayName: 'Course:Activity',

	mixins: [ContextParent],

	propTypes: {
		course: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
		};
	},

	componentDidMount () {
		this.setUpStore();
	},

	componentWillUpdate (_, nextState) {
		let {store} = this.state;
		let nextStore = nextState.store;

		if (store && store !== nextStore) {
			store.removeListener('change', this.onStoreChange);
		}

		if (nextStore && nextStore !== store) {
			nextStore.addListener('change', this.onStoreChange);

			if (!nextStore.loading) {
				console.log('Wut?');
			}
		}
	},

	componentDidUpdate () {
		this.refs.scrollTrigger.checkInView(true);
	},

	onStoreChange () {
		this.forceUpdate();
	},

	setUpStore (props = this.props) {
		let {course, filterParams} = props;
		let store = null;
		if (course) {
			store = course.getActivity(filterParams);
		}

		this.setState({store});
	},

	loadMore () {
		let {store} = this.state;
		if ((store || {}).hasMore) {
			store.nextBatch();
		}
	},

	render () {
		let contentPackage = this.props.course;
		let {store} = this.state;
		return (
			<GradientBackground imgUrl={contentPackage.getPresentationProperties().background}>
				<div className="course-activity">
					<Banner contentPackage={contentPackage} />
					<ul className="activity-buckets">{store && store.map((bucket, index) => <ActivityBucket key={`bucket-${index}`} bucket={bucket} />)}</ul>
					<ScrollTrigger ref="scrollTrigger" onEnterView={this.loadMore} />
					{store && store.loading && <Loading />}
				</div>
			</GradientBackground>
		);
	}
});
