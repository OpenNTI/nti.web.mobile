import React from 'react';

import {getModel} from 'nti.lib.interfaces';
import PageSource from 'nti.lib.interfaces/models/ListBackedPageSource';
import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import Loading from 'common/components/Loading';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import Detail from './Detail';
import Item from './Item';

const Note = getModel('note');

export default React.createClass({
	displayName: 'content:Discussions',
	mixins: [
		ContextSender,
		NavigatableMixin
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
			href: this.makeHref('/')
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
				this.onUserDataChange(nextStore, props);
			}
		} else {
			console.debug('Nothing.');
		}
	},


	onUserDataChange (store, props = this.props) {
		let items, item, {filter, itemId} = props;

		if (store) {
			items = [];
			item = itemId && store.get(decodeFromURI(itemId));

			for (let x of store) {
				if (x instanceof Note && (!filter || filter.includes(x.getID()))) {
					items.push(x);
				}
			}
		}

		this.setState({items, item, pageSource: item && new PageSource(items)});
	},


	render () {
		let {state, props} = this;
		let {items, item, pageSource} = state;
		let {itemId} = props;

		props = Object.assign({}, props);
		delete props.itemId;


		if (itemId) {
			items = null;
		}

		return item ? (
			<Detail item={item} pageSource={pageSource}/>
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
