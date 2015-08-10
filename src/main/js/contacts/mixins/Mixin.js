import React from 'react';
import Api from '../Api';
import Loading from 'common/components/Loading';
import Err from 'common/components/Error';

export default {

	getInitialState () {
		return {
			store: null,
			search: null
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

	updateSearchQuery () {
		let query = this.refs.search.getDOMNode().value;
		let {store} = this.state;

		this.setState({
			search: query,
			searchLoading: true
		});

		if (store && store.search) {
			store.search(query)
				.then(results => {
					// search results include communities and friends lists; we only want users
					let users = results.filter((entity) => entity.isUser);
					this.setState({
						searchResults: users,
						searchLoading: false
					});
				});
		}
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
		let {search, searchLoading, searchResults} = this.state;
		for(let item of store) {
			if(!store.entityMatchesQuery || store.entityMatchesQuery(item, search)) {
				items.push(this.renderListItem(item));
			}
		}

		return (
			<div>
				{this.hasSearch && <div><input type="search" className="search-field" ref="search" onChange={this.updateSearchQuery}/></div>}
				<ul className={'contacts-list ' + this.props.listClassName}>{items}</ul>
				{searchLoading && <Loading/>}
				{searchResults &&
					<div className="search-results">
						<h2>Search Results</h2>
						<ul className="avatar-grid">
						{
							searchResults.map(entity => {
								return <li>{this.renderListItem(entity)}</li>;
							})
						}
						</ul>
					</div>
				}
			</div>
		);
	}

};
