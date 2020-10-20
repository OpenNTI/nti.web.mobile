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

	getSnapshotBeforeUpdate () {
		this.setUpStore();
		return null;
	},

	componentDidUpdate (_, prevState) {
		let {store} = prevState;
		let nextStore = this.state.store;

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

	setUpStore () {
		getStore(this.storeType)
			.then(store => this.setState({store}));
	}

};
