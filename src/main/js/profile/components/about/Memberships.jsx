import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { EmptyList } from '@nti/web-commons';
import { ViewEvent } from '@nti/web-session';

import ProfileAnalytics from '../../mixins/AnalyticsMixin';

import MembershipList from './MembershipList';

export default createReactClass({
	displayName: 'Memberships',

	mixins: [ProfileAnalytics],

	propTypes: {
		entity: PropTypes.shape({
			getMemberships: PropTypes.func.isRequired,
		}).isRequired,

		preview: PropTypes.bool,
	},

	getAnalyticsType() {
		return 'ProfileMembershipView';
	},

	getInitialState() {
		return {
			store: null,
		};
	},

	componentDidMount() {
		this.setStore();
	},

	componentWillUnmount() {
		let { store } = this.state;
		if (store) {
			store.removeListener('change', this.onStoreChange);
		}
	},

	componentDidUpdate(prevProps, prevState) {
		const { entity } = this.props;
		const { store } = this.state;
		const prevStore = prevState.store;

		if (entity !== prevProps.entity) {
			this.setStore();
		}

		if (prevStore && prevStore !== store) {
			prevStore.removeListener('change', this.onStoreChange);
		}

		if (store && store !== prevStore) {
			store.addListener('change', this.onStoreChange);

			if (!store.loading) {
				// console.log('Wut?');
			}
		}
	},

	setStore(entity = this.props.entity) {
		let store = null;
		if (entity) {
			store = entity.getMemberships();
		}

		this.setState({ store });
	},

	onStoreChange(store) {
		let groups = [];
		let communities = [];

		for (let membership of store) {
			let list = membership.isCommunity ? communities : groups;
			list.push(membership);
		}

		this.setState({ groups, communities });
	},

	render() {
		let { groups = [], communities = [] } = this.state;
		let { preview } = this.props;

		if (communities.length + groups.length === 0) {
			return <EmptyList type="memberships" />;
		}

		return (
			<div className="profile-memberships">
				{!preview && <ViewEvent {...this.getAnalyticsData()} />}
				<MembershipList
					list={communities}
					title="Communities"
					preview={preview}
				/>
				<MembershipList
					list={groups}
					title="Groups"
					preview={preview}
				/>
			</div>
		);
	},
});
