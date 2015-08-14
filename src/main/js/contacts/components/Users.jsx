import React from 'react/addons';
import mixin from '../mixins/Mixin';
import Loading from 'common/components/Loading';
import {USERS} from '../Constants';
import AvatarProfileLink from 'profile/components/AvatarProfileLink';
import Err from 'common/components/Error';
import ContextSender from 'common/mixins/ContextSender';

import {scoped} from 'common/locale';

let t = scoped('CONTACTS');

export default React.createClass({
	displayName: 'Contacts:Users',
	mixins: [mixin, ContextSender],
	storeType: USERS,

	getDefaultProps () {
		return {
			listClassName: 'users avatar-grid'
		};
	},

	listName: 'Contacts',

	getContext () {
		return Promise.resolve({
			label: 'Contacts'
		});
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

	searchField (items) {

		let {search, searchResults} = this.state;

		return (
			<div>
				<div className="search-field">
					<input type="search" ref="search" onChange={this.updateSearchQuery} value={search} placeholder={t('searchFieldPlaceholder')} />
					<div className={'icon ' + (search.length > 0 ? 'clear-search-icon' : 'search-icon')} onClick={this.clearSearch} />
				</div>
				<div>
					{this.resultsSummary(items, searchResults)}
				</div>
			</div>
		);
	},

	beforeList (items) {
		return this.searchField(items);
	},

	afterList () {
		return (
			<div className="search-results">
				{this.searchResults()}
			</div>
		);
	},

	renderListItem (item) {
		return (
			<li key={'avatar' + item.Username}>
				<AvatarProfileLink entity={item} />
			</li>
		);
	}

});
