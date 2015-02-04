import LibraryStore from '../Store';
import {load} from '../Actions';

import StoreEvents from 'common/mixins/StoreEvents';

export default {
	mixins: [StoreEvents],

	backingStore: LibraryStore,
	backingStoreEventHandlers: {
		default: function () {
			if (this.isMounted()){
				this.forceUpdate();
			}
		}
	},

	componentDidMount () { this.ensureLibraryLoaded(); },
	componentWillReceiveProps () { this.ensureLibraryLoaded(); },

	ensureLibraryLoaded () {
		return load();//will return the same promise every time until reloaded.
	},


	getLibrary () {
		return LibraryStore.getData();
	}
};
