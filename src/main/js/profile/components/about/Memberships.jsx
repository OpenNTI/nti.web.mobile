import React from 'react';

import createReactClass from 'create-react-class';

import MembershipList from './MembershipList';
import {EmptyList} from 'nti-web-commons';

import ProfileAnalytics from '../../mixins/AnalyticsMixin';
import {PROFILE_MEMBERSHIP_VIEWED} from 'nti-analytics';


export default createReactClass({
	displayName: 'Memberships',

	mixins: [ProfileAnalytics],

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

		if (nextStore && nextStore !== store) {
			nextStore.addListener('change', this.onStoreChange);

			if (!nextStore.loading) {
				// console.log('Wut?');
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

		if(communities.length + groups.length === 0) {
			return <EmptyList type="memberships" />;
		}

		return (
			<div className="profile-memberships">
				<MembershipList list={communities} title="Communities" preview={preview}/>
				<MembershipList list={groups} title="Groups" preview={preview}/>
			</div>
		);
	}
});
