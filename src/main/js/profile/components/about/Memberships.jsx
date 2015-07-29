import React from 'react';

import MembershipList from './MembershipList';
import EmptyList from 'common/components/EmptyList';

import ProfileAnalytics from '../../mixins/AnalyticsMixin';
import ResourceLoaded from 'analytics/mixins/ResourceLoaded';
import {PROFILE_MEMBERSHIP_VIEWED} from 'nti.lib.interfaces/models/analytics/MimeTypes';

export default React.createClass({
	displayName: 'Memberships',

	mixins: [ResourceLoaded, ProfileAnalytics],

	propTypes: {
		entity: React.PropTypes.shape({
			getMemberships: React.PropTypes.func.isRequired
		}).isRequired,

		preview: React.PropTypes.bool
	},

	getAnalyticsMimeType () {
		return PROFILE_MEMBERSHIP_VIEWED;
	},

	getInitialState () {
		return {
			store: null
		};
	},

	componentDidMount () {
		this.setStore();
	},


	componentWillReceiveProps (nextProps) {
		let {entity} = nextProps;

		if(entity !== this.props.entity) {
			this.setStore(entity);
		}
	},


	componentWillUnmount () {
		let {store} = this.state;
		if (store) {
			store.removeListener('change', this.onStoreChange);
		}
	},


	componentWillUpdate (_, nextState) {
		let {store} = this.state;
		let nextStore = nextState.store;

		if (store && store !== nextStore) {
			store.removeListener('change', this.onStoreChange);
		}
		else if (nextStore && nextStore !== store) {
			nextStore.addListener('change', this.onStoreChange);

			if (!nextStore.loading) {
				console.log('Wut?');
			}
		}
	},


	setStore (entity = this.props.entity) {
		let store = null;
		if (entity) {
			store = entity.getMemberships();
		}

		this.setState({store});
	},


	onStoreChange (store) {
		let groups = [];
		let communities = [];

		for (let membership of store) {
			let list = membership.isCommunity ? communities : groups;
			list.push(membership);
		}

		this.setState({groups, communities});
	},


	render () {
		let {groups = [], communities = []} = this.state;
		let {preview} = this.props;

		return (
			<div className="profile-memberships">
				<MembershipList list={communities} title="Communities" preview={preview}/>
				<MembershipList list={groups} title="Groups" preview={preview}/>
				{communities.length + groups.length === 0 && <EmptyList type="memberships" />}
			</div>
		);
	}
});
