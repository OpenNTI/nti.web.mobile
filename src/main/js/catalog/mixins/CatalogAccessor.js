import CatalogStore from '../Store';
import {load} from '../Actions';

import StoreEvents from 'common/mixins/StoreEvents';

export default {
	mixins: [StoreEvents],

	backingStore: CatalogStore,
	backingStoreEventHandlers: {
		default: function () {
			let catalog = this.getCatalog();
			if (this.isMounted()){
				this.setState({catalog});
			}
		}
	},

	componentDidMount () { this.ensureCatalogLoaded(); },
	componentWillReceiveProps () { this.ensureCatalogLoaded(); },

	ensureCatalogLoaded () {
		return load();//will return the same promise every time until reloaded.
	},


	getCatalog () {
		return CatalogStore.getData();
	},


	setPageSourceData (pageSource) {
		CatalogStore.setActivePageSource(pageSource);
	}
};
