import React from 'react';
import Api from '../Api';
import Loading from 'common/components/Loading';
import Err from 'common/components/Error';
import {scoped} from 'common/locale';

let t = scoped('CONTACTS');

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
		.then(store => this.setState({
			store
		}));
	},

	updateSearchQuery (event) {
		let query = event ? event.target.value.trim() : '';
		let {store} = this.state;

		this.setState({
			search: query,
			searchLoading: query.length > 0,
			searchResults: null,
			searchError: null
		});

		if (store && store.search) {
			let search = store.search(query);
			search.catch(reason=> {
				if (typeof reason !== 'object' || reason.statusCode !== -1) {
					this.setState({
						searchError: reason
					});
				}
			});
			search.then(results => {
				// search results include communities and friends lists; we only want users
				let users = results.filter((entity) => entity.isUser);
				this.setState({
					searchResults: users,
					searchLoading: false
				});
			});
		}
	},

	searchResults () {
		let {searchLoading, searchError, searchResults} = this.state;
		if (searchError) {
			return <Err error={searchError} />;
		}
		if (searchLoading) {
			return <Loading/>;
		}
		if (searchResults) {
			return (
				<div>
					<h2>Search Results</h2>
					<ul className="avatar-grid">
					{
						searchResults.map((entity) => this.renderListItem(entity))
					}
					</ul>
				</div>
			);
		}
	},

	resultsSummary (items, searchResults) {
		return searchResults && (
			<div className="search-summary">
				<div>
					<div>Searching for {this.state.search}:</div>
					<div>{t('filteredContacts', {count: items.length})}, {t('searchResults', {count: searchResults.length})}.</div>	
				</div>
			</div>
		);
	},

	clearSearch () {
		this.updateSearchQuery();
	},

	render () {

		let {error, store, searchResults} = this.state;

		if (error) {
			return <Err error={error} />;
		}

		if (!store || store.loading) {
			return <Loading />;
		}

		let items = [];
		let {search} = this.state;
		for(let item of store) {
			if(!store.entityMatchesQuery || store.entityMatchesQuery(item, search)) {
				items.push(this.renderListItem(item));
			}
		}

		return (
			<div>
				{this.hasSearch &&
					<div>
						<div className="search-field">
							<input type="search" ref="search" onChange={this.updateSearchQuery} value={search} />
							<div className={'icon ' + (search.length > 0 ? 'clear-search-icon' : 'search-icon')} onClick={this.clearSearch} />
						</div>
						<div>
							{this.resultsSummary(items, searchResults)}
						</div>
					</div>
				}
				<div>
					{this.listName && <h2>{this.listName}</h2>}
					<ul className={'contacts-list ' + this.props.listClassName}>{items}</ul>
				</div>
				<div className="search-results">
					{this.searchResults()}
				</div>
			</div>
		);
	}

};
