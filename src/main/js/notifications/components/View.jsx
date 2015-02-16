import React from 'react';
import Loading from 'common/components/Loading';
import InlineLoader from 'common/components/LoadingInline';
import Button from 'common/forms/components/Button';

import StoreEvents from 'common/mixins/StoreEvents';

import Store from '../Store';

import {load, loadMore} from '../Actions';
import {getNotificationItem} from './kinds';

const Empty = React.createClass({

	render () {
		return (
			<li className="notification-item empty">
				All Caught Up!
			</li>
		);
	}

});


const LoadMore = React.createClass({

	render () {
		var store = this.props.store;
		return (
			<div className="text-center button-box">
				{store.isBusy ?
					<InlineLoader/>
				:
					<Button onClick={this.props.onClick}>Load More</Button>
				}
			</div>
		);
	}

});


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
		var list = Store.getData();
		this.setState({
			length: list && list.length,
			notifications: list
		});
	},


	getItems () {
		var {state} = this;
		return (state || {}).notifications || {};
	},


	render () {
		var list = this.getItems();
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
