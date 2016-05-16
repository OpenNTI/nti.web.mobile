import CatalogStore from '../Store';
import {load} from '../Actions';

import {StoreEventsMixin} from 'nti-lib-store';

export default {
	mixins: [StoreEventsMixin],

	backingStore: CatalogStore,
	backingStoreEventHandlers: {
		default () {
			let catalog = this.getCatalog();
			this.setState({catalog, catalogLoading: CatalogStore.loading});
		}
	},

	getInitialState () { return { catalog: null }; },

	componentDidMount () { this.ensureCatalogLoaded(); },
	componentWillReceiveProps () { this.ensureCatalogLoaded(); },

	ensureCatalogLoaded () {
		this.setState({catalogLoading: CatalogStore.loading});
		return load();//will return the same promise every time until reloaded.
	},


	getCatalog () {
		return CatalogStore.getData();
	},


	getCatalogEntry (id) {
		return CatalogStore.getEntry(id);
	},


	setPageSourceData (pageSource) {
		CatalogStore.setActivePageSource(pageSource);
	}
};
