import { StoreEventsMixin } from '@nti/lib-store';

import LibraryStore from '../Store';
import { load } from '../Actions';

export default {
	mixins: [StoreEventsMixin],

	backingStore: LibraryStore,
	backingStoreEventHandlers: {
		default() {
			if (this.mounted) {
				this.forceUpdate();
			}
		},
	},

	getInitialState() {
		return { loading: true };
	},

	componentDidMount() {
		this.mounted = true;
		this.ensureLibraryLoaded();
	},

	componentWillUnmount() {
		this.mounted = false;
	},

	componentDidUpdate() {
		this.ensureLibraryLoaded();
	},

	async ensureLibraryLoaded() {
		await load();

		if (this.mounted && this.state.loading) {
			this.setState({ loading: false });
		}
	},

	getLibrary() {
		return LibraryStore.getData();
	},
};
