import React from 'react';
import Loading from 'common/components/Loading';

import StoreEvents from 'common/mixins/StoreEvents';

import Store from '../Store';

import {load, loadMore} from '../Actions';
import {getNotificationItem} from './kinds';

import Empty from './Empty';
import LoadMore from './LoadMore';


export default React.createClass({
	displayName: 'NotificationsView',
	mixins: [StoreEvents],

	getInitialState () { return {}; },

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore'
	},


	componentDidMount () { this.ensureLoaded(); },
	componentWillReceiveProps () { this.ensureLoaded(); },


	ensureLoaded () {
		if(!Store.isLoaded) {
			load();
		}
		this.synchronizeFromStore();
	},

	onLoadMore () {
		loadMore(this.state.notifications);
		this.forceUpdate();
	},


	synchronizeFromStore () {
		let list = Store.getData();
		this.setState({
			length: list && list.length,
			notifications: list
		});
	},


	getItems () {
		let {state} = this;
		return (state || {}).notifications || {};
	},


	render () {
		let list = this.getItems();
		if (!list.map) {
			return <Loading />;
		}

		return (
			<ul className="off-canvas-list">
				<li><label>Notifications</label></li>
				{list.length ? list.map(getNotificationItem) : <Empty/>}
				{list.hasMore ?
					<LoadMore onClick={this.onLoadMore} store={list}/> : null
				}
			</ul>
		);
	}
});
