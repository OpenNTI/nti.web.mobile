import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {
	Locations,
	Location,
	NotFound as Default,
} from 'react-router-component';

// import Logger from '@nti/util-logger';
import { getModel } from '@nti/lib-interfaces';
import { Paging } from '@nti/lib-commons';
// import {decodeFromURI} from '@nti/lib-ntiids';
import { Loading } from '@nti/web-commons';
import ContextMixin from 'internal/common/mixins/ContextSender';

import List from './List';
import View from './View';

const PageSource = Paging.ListBackedPageSource;

// const logger = Logger.get('content:components:discussions');
const Note = getModel('note');

/**
 * This Router layer exsists to provide abstraction to routers and link generations.
 *
 * Without this we have to bake in too much knowledge into the parent Viewer component's mock-router.
 */
export default createReactClass({
	displayName: 'content:discussions',
	mixins: [ContextMixin],

	getContext() {
		const { router } = this;
		return !router
			? []
			: {
					label: 'Discussions',
					href: router.makeHref('/'),
			  };
	},

	propTypes: {
		UserDataStoreProvider: PropTypes.shape({
			getUserDataStore: PropTypes.func,
		}),

		contentPackage: PropTypes.object,
		filter: PropTypes.arrayOf(PropTypes.string),
	},

	getInitialState() {
		return { loading: true };
	},

	getStore(props = this.props) {
		let { UserDataStoreProvider } = props;
		return (
			UserDataStoreProvider && UserDataStoreProvider.getUserDataStore()
		);
	},

	componentDidMount() {
		this.updateStore(this.props, true);
	},

	componentDidUpdate(prevProps) {
		if (this.getStore() !== this.getStore(prevProps)) {
			this.updateStore(this.props);
		}
	},

	updateStore(props, mounting) {
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
				this.setState({ loading: true });
			}
		}
	},

	onUserDataChange(store, props = this.props) {
		let items,
			{ filter, contentPackage } = props;
		const id = `${
			contentPackage ? contentPackage.getID() : store.rootId
		}-discussions`;

		if (store) {
			items = [];

			for (let x of store) {
				if (
					x instanceof Note &&
					(!filter || filter.includes(x.getID()))
				) {
					items.push(x);
				}
			}
		}

		this.setState({
			loading: false,
			items,
			store,
			pageSource: new PageSource(items, '', id),
		});
	},

	attachRef(ref) {
		this.router = ref;
	},

	render() {
		const { store, items, loading, pageSource } = this.state;
		const props = { ...this.props, store, pageSource };

		return !store || loading ? (
			<Loading.Mask />
		) : (
			<Locations contextual ref={this.attachRef}>
				<Location
					path="/:itemId/edit(/*)"
					handler={View}
					{...props}
					edit
				/>
				<Location path="/:itemId(/*)" handler={View} {...props} />

				<Default handler={List} items={items} />
			</Locations>
		);
	},
});
