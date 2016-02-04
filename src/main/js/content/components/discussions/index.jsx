import React from 'react';

import {Locations, Location, NotFound as Default} from 'react-router-component';

// import Logger from 'nti-util-logger';
import {getModel} from 'nti-lib-interfaces';
import PageSource from 'nti-lib-interfaces/lib/models/ListBackedPageSource';
// import {decodeFromURI} from 'nti-lib-ntiids';

import ContextMixin from 'common/mixins/ContextSender';
import Loading from 'common/components/Loading';

import List from './List';
import View from './View';

// const logger = Logger.get('content:components:discussions');
const Note = getModel('note');


/**
 * This Router layer exsists to provide abstraction to routers and link generations.
 *
 * Without this we have to bake in too much knowledge into the parent Viewer component's mock-router.
 */
export default React.createClass({
	displayName: 'content:discussions',
	mixins: [
		ContextMixin
	],

	getContext () {
		const {router} = this.refs;
		return router && {
			label: 'Discussions',
			href: router.makeHref('/')
		};
	},

	propTypes: {
		UserDataStoreProvider: React.PropTypes.shape({
			getUserDataStore: React.PropTypes.func
		}),

		filter: React.PropTypes.arrayOf(React.PropTypes.string)

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
		if (this.getStore() !== this.getStore(nextProps)) {
			this.updateStore(nextProps);
		}
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
		let items, {filter} = props;

		if (store) {
			items = [];

			for (let x of store) {
				if (x instanceof Note && (!filter || filter.includes(x.getID()))) {
					items.push(x);
				}
			}
		}

		this.setState({
			loading: false,
			items,
			store,
			pageSource: new PageSource(items)});
	},

	render () {
		const {store, items, loading, pageSource} = this.state;
		const props = Object.assign({}, this.props, { store, pageSource });

		return (!store || loading) ? (
			<Loading/>
		) : (
			<Locations contextual ref="router">
				<Location path="/:itemId/edit(/*)" handler={View} {...props} edit/>
				<Location path="/:itemId(/*)" handler={View} {...props}/>

				<Default handler={List} items={items} {...props}/>
			</Locations>
		);
	}
});
