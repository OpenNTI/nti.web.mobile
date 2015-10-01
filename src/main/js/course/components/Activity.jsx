import React from 'react';
import Banner from 'common/components/Banner';
import ActivityBucket from './ActivityBucket';
import ScrollTrigger from 'common/components/ScrollTrigger';

export default React.createClass({
	displayName: 'Course:Activity',

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
			<div className="course-activity">
				<Banner contentPackage={contentPackage} />
				<ul className="activity-buckets">{store && store.map((bucket, index) => <ActivityBucket key={`bucket-${index}`} bucket={bucket} />)}</ul>
				<ScrollTrigger onEnterView={this.loadMore} />
			</div>
		);
	}
});
