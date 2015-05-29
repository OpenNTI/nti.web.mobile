import React from 'react';

import {getModel} from 'nti.lib.interfaces';

import Loading from 'common/components/Loading';

import ContextSender from 'common/mixins/ContextSender';

import Item from './DiscussionItem';

const Note = getModel('note');

export default React.createClass({
	displayName: 'content:Discussions',
	mixins: [
		ContextSender
	],

	propTypes: {
		page: React.PropTypes.shape({
			getUserDataStore: React.PropTypes.func
		}),

		itemId: React.PropTypes.string,

		filter: React.PropTypes.arrayOf(React.PropTypes.string)
	},


	getContext () {
		return Promise.resolve({
			label: 'Discussions',
			href: location.href
		});
	},


	getInitialState () {
		return {};
	},


	getStore (props = this.props) {
		let {page} = props;
		return page && page.getUserDataStore();
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
			store.removeListener('load', this.onUserDataChange);
		}
		else if (nextStore) {
			if (nextStore !== store || mounting) {
				nextStore.addListener('load', this.onUserDataChange);
			}

			if (!nextStore.loading) {
				this.onUserDataChange(nextStore);
			}
		}
	},


	onUserDataChange (store) {
		let items, item, {filter, itemId} = this.props;

		if (store) {
			items = [];
			item = itemId && store.get(itemId);

			for (let x of store) {
				if (x instanceof Note && (!filter || filter.includes(x.getID()))) {
					items.push(x);
				}
			}
		}

		this.setState({items, item});
	},


	render () {
		let {state, props} = this;
		let {items, item} = state;

		return item ? (
			<div>{item.getID()}</div>
		) : (
			<div className="discussions" {...props}>
				<div className="list">
					{!items ? ( <Loading/> ) :
						items.map(x => <Item item={x} key={x.getID()}/>)}
				</div>
			</div>
		);
	}
});
