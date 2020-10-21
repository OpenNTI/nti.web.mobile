import {getStore} from '../Api';

export default {

	getInitialState () {
		return {
			store: null,
			search: ''
		};
	},

	componentDidMount () {
		this.setUpStore();
	},

	async componentDidUpdate (_, {store}) {
		const nextStore = await this.setUpStore();

		if (store && store !== nextStore) {
			store.removeListener('change', this.onStoreChange);
		}
		if (nextStore && nextStore !== store) {
			nextStore.addListener('change', this.onStoreChange);
		}
	},

	componentWillUnmount () {
		let {store} = this.state;
		if (store) {
			store.removeListener('change', this.onStoreChange);
		}
	},

	onStoreChange () {
		this.forceUpdate();
	},

	async setUpStore () {
		const store = await getStore(this.storeType);
		if (this.state.store !== store) {
			this.setState({store});
		}
		return store;
	}

};
