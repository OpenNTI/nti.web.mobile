import React from 'react';

import {getModel} from 'nti.lib.interfaces';

import Loading from 'common/components/Loading';

import ContextSender from 'common/mixins/ContextSender';

import Item from './DiscussionItem';

const Note = getModel('note');

function getStore (props) {
	let {page} = props;
	return page && page.getUserDataStore();
}

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


	componentDidMount () {
		this.updateStore(this.props, true);
	},


	componentWillReceiveProps (nextProps) {
		this.updateStore(nextProps);
	},


	updateStore (props, mounting) {
		let store = getStore(this.props);
		let nextStore = getStore(props);
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
		let items, {filter} = this.props;

		if (store) {
			items = [];

			for (let item of store) {
				if (item instanceof Note && (!filter || filter.includes(item.getID()))) {
					items.push(item);
				}
			}
		}

		this.setState({items});
	},


	render () {
		let {state, props} = this;
		let {items} = state;
		let {itemId} = props;

		return itemId ? (
			<div>{itemId}</div>
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
