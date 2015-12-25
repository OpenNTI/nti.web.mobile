import React from 'react';

import {getModel} from 'nti.lib.interfaces';
import PageSource from 'nti.lib.interfaces/lib/models/ListBackedPageSource';
import {decodeFromURI} from 'nti.lib.interfaces/lib/utils/ntiids';

import Empty from 'common/components/EmptyList';
import Loading from 'common/components/Loading';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import NotFound from 'notfound/components/View';

import View from './View';
import Item from './Item';

const Note = getModel('note');

export default React.createClass({
	displayName: 'content:Discussions',
	mixins: [
		ContextSender,
		NavigatableMixin
	],

	propTypes: {
		UserDataStoreProvider: React.PropTypes.shape({
			getUserDataStore: React.PropTypes.func
		}),

		itemId: React.PropTypes.string,

		filter: React.PropTypes.arrayOf(React.PropTypes.string)
	},


	getContext () {
		return Promise.resolve({
			label: 'Discussions',
			href: this.makeHref('/')
		});
	},


	getInitialState () {
		return {loading: true};
	},


	getStore (props = this.props) {
		let {UserDataStoreProvider} = props;
		return UserDataStoreProvider && UserDataStoreProvider.getUserDataStore();
	},


	componentDidMount () {
		this.updateStore(this.props, true);
	},


	componentWillReceiveProps (nextProps) {
		this.updateStore(nextProps);
	},


	updateStore (props, mounting) {
		let store = this.getStore();
		let nextStore = this.getStore(props);


		if (store && store !== nextStore) {
			store.removeListener('change', this.onUserDataChange);
		}

		if (nextStore) {
			if (nextStore !== store || mounting) {
				nextStore.addListener('change', this.onUserDataChange);
			}

			if (!nextStore.loading) {
				this.onUserDataChange(nextStore, props);
			} else {
				this.setState({loading: true});
			}
		}
	},


	onUserDataChange (store, props = this.props) {
		let items, item, {filter, itemId} = props;

		if (store) {
			items = [];
			item = itemId && store.get(decodeFromURI(itemId));
			if (!item && itemId) {
				console.error(store, itemId, decodeFromURI(itemId));
			}

			for (let x of store) {
				if (x instanceof Note && (!filter || filter.includes(x.getID()))) {
					items.push(x);
				}
			}
		}

		this.setState({
			loading: false,
			items,
			item,
			pageSource: item && new PageSource(items)});
	},


	render () {
		let {state, props} = this;
		let {items, item, loading, pageSource} = state;
		let {itemId} = props;

		props = Object.assign({}, props);
		delete props.itemId;


		if (itemId) {
			items = null;
		}

		return itemId ? (
			item
			? ( <View item={item} pageSource={pageSource}/> )
			: loading
				? ( <Loading/> )
				: ( <NotFound/> )
		) : (
			<div className="discussions" {...props}>
				{props.children}
				<div className="list">
					{!items
						? ( <Loading/> )
						: items.length
							? items.map(x => <Item item={x} key={x.getID()}/>)
							: ( <Empty type="discussions"/> )
					}
				</div>
			</div>
		);
	}
});
