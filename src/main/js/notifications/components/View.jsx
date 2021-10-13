import './View.scss';
import createReactClass from 'create-react-class';
import cx from 'classnames';

import { Loading } from '@nti/web-commons';
import { StoreEventsMixin } from '@nti/lib-store';

import Store from '../Store';
import { load, loadMore } from '../Actions';

import { getNotificationItem } from './kinds';
import Empty from './Empty';
import LoadMore from './LoadMore';

export default createReactClass({
	displayName: 'NotificationsView',
	mixins: [StoreEventsMixin],

	getInitialState() {
		return {};
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore',
	},

	componentDidMount() {
		this.ensureLoaded();
	},

	ensureLoaded() {
		if (!Store.isLoaded) {
			load();
		}
		this.synchronizeFromStore();
	},

	onLoadMore() {
		loadMore(this.state.notifications);
		this.forceUpdate();
	},

	synchronizeFromStore() {
		let list = Store.getData();
		this.setState({
			length: list && list.length,
			notifications: list,
		});
	},

	getItems() {
		let { state } = this;
		return (state || {}).notifications || {};
	},

	render() {
		let list = this.getItems();
		const loading = !list.map;
		const empty = !list.length;

		return (
			<div className={cx('notifications', { loading, empty })}>
				{loading ? (
					<Loading.Spinner />
				) : empty ? (
					<Empty />
				) : (
					<ul className="off-canvas-list">
						{!empty && list.map(getNotificationItem)}
						{list.hasMore && (
							<LoadMore onClick={this.onLoadMore} store={list} />
						)}
					</ul>
				)}
			</div>
		);
	},
});
