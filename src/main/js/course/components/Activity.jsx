import './Activity.scss';
import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Banner, ScrollTrigger, Loading, Mixins} from '@nti/web-commons';

import ContextSender from 'common/mixins/ContextSender';

import ContextParent from '../mixins/AssignmentHistoryContextParent';
import {ACTIVITY} from '../Sections';

import ActivityBucket from './ActivityBucket';


export default createReactClass({
	displayName: 'Course:Activity',

	mixins: [ContextSender, Mixins.NavigatableMixin, ContextParent],

	propTypes: {
		filterParams: PropTypes.object,
		course: PropTypes.object.isRequired
	},

	getInitialState () {
		return {
		};
	},

	componentDidMount () {
		this.setUpStore();
	},

	componentDidUpdate (_, prevState) {
		let {store: nextStore} = this.state;
		let {store} = prevState;

		if (store && store !== nextStore) {
			store.removeListener('change', this.onStoreChange);
		}

		if (nextStore && nextStore !== store) {
			nextStore.addListener('change', this.onStoreChange);

			// if (!nextStore.loading) {
			// 	console.log('Wut?');
			// }
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
				{store && store.loading && <Loading.Mask />}
			</div>
		);
	}
});
