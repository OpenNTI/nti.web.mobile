import React from 'react';
import Api from '../Api';
import Loading from 'common/components/Loading';
import Err from 'common/components/Error';
import EmptyList from 'common/components/EmptyList';

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
			.then(store => this.setState({store}));
	},

	render () {

		let {error, search, store} = this.state;

		if (error) {
			return <Err error={error} />;
		}

		if (!store || store.loading) {
			return <Loading />;
		}

		let items = [];
		for(let item of store) {
			if(!store.entityMatchesQuery || store.entityMatchesQuery(item, search)) {
				items.push(this.renderListItem(item));
			}
		}

		return (
			<div>
				{this.beforeList && this.beforeList(items)}
				<div>
					{this.listName && <h2>{this.listName}</h2>}
					{items.length > 0 ? <ul className={'contacts-list ' + this.props.listClassName}>{items}</ul> : <EmptyList type="contacts" />}
				</div>
				{this.afterList && this.afterList()}
			</div>
		);
	}

};
