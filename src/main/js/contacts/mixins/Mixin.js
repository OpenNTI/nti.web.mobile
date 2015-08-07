import React from 'react';
import Api from '../Api';
import Loading from 'common/components/Loading';
import Err from 'common/components/Error';

export default {

	getInitialState () {
		return {
			store: null
		};
	},

	componentDidMount () {
		this.setUpStore();
	},

	componentWillReceiveProps () {
		this.setUpStore();
	},

	componentWillUpdate (_, nextState) {
		let {store} = this.state;
		let nextStore = nextState.store;

		if (store && store !== nextStore) {
			store.removeListener('change', this.onStoreChange);
		}
		else if (nextStore && nextStore !== store) {
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
		Api.getStore(this.storeType)
		.then(store => this.setState({
			store
		}));
	},

	render () {

		let {error, store} = this.state;

		if (error) {
			return <Err error={error} />;
		}

		if (!store || store.loading) {
			return <Loading />;
		}

		let items = [];
		for(let item of store) {
			items.push(<li key={item.Username}>{item.Username}</li>);
		}

		return (
			<div >
				<ul className={'contacts-list ' + this.props.listClassName}>{items}</ul>
			</div>
		);
	}

};
