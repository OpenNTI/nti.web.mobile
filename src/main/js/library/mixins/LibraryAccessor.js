import LibraryStore from '../Store';
import {load} from '../Actions';

import StoreEvents from 'common/mixins/StoreEvents';

export default {
	mixins: [StoreEvents],

	backingStore: LibraryStore,
	backingStoreEventHandlers: {
		default () {
			if (this.mounted) {
				this.forceUpdate();
			}
		}
	},

	getInitialState () {
		return { loading: true };
	},

	componentDidMount () {
		this.mounted = true;
		this.ensureLibraryLoaded();
	},

	componentWillUnmount () {
		this.mounted = false;
	},

	componentWillReceiveProps () { this.ensureLibraryLoaded(); },

	ensureLibraryLoaded () {
		let promise = load();//will return the same promise every time until reloaded.

		promise.then(() => {
			if (this.mounted) {
				this.setState({loading: false});
			}
		});

		return promise;
	},


	getLibrary () {
		return LibraryStore.getData();
	}
};
