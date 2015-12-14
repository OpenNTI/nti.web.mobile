import React from 'react';

import Banner from 'common/components/Banner';
import ScrollTrigger from 'common/components/ScrollTrigger';
import Loading from 'common/components/Loading';

import ActivityBucket from './ActivityBucket';
import {ACTIVITY} from '../Sections';

import NavigatableMixin from 'common/mixins/NavigatableMixin';
import ContextSender from 'common/mixins/ContextSender';
import ContextParent from '../mixins/AssignmentHistoryContextParent';


export default React.createClass({
	displayName: 'Course:Activity',

	mixins: [ContextSender, NavigatableMixin, ContextParent],

	propTypes: {
		filterParams: React.PropTypes.object,
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


	getContext () {
		let {course} = this.props;
		let {title} = course.getPresentationProperties();

		let href = this.makeHref(ACTIVITY);
		let ntiid = course.getID();

		return Promise.resolve({
			label: title,
			ntiid,
			href
		});
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
				<Banner item={contentPackage} />
				<ul className="activity-buckets">{store && store.map((bucket, index) => <ActivityBucket key={`bucket-${index}`} bucket={bucket} />)}</ul>
				<ScrollTrigger onEnterView={this.loadMore} />
				{store && store.loading && <Loading />}
			</div>
		);
	}
});
