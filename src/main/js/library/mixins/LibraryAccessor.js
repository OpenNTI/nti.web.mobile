import {StoreEventsMixin} from '@nti/lib-store';

import LibraryStore from '../Store';
import {load} from '../Actions';


export default {
	mixins: [StoreEventsMixin],

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
