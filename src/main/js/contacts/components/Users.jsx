import React from 'react/addons';
import mixin from '../mixins/Mixin';
import Loading from 'common/components/Loading';
import {USERS} from '../Constants';
import Err from 'common/components/Error';
import ContextSender from 'common/mixins/ContextSender';
import SelectableEntity from './SelectableEntity';
import {areYouSure} from 'prompts';
import {scoped} from 'common/locale';
import EmptyList from 'common/components/EmptyList';
import UserSearchField from './UserSearchField';

let t = scoped('CONTACTS');

export default React.createClass({
	displayName: 'Contacts:Users',
	mixins: [mixin, ContextSender],
	storeType: USERS,

	listName: 'Contacts',

	getContext () {
		return Promise.resolve({
			label: 'Contacts'
		});
	},

	updateSearchQuery (event) {
		let query = event ? event.target.value : '';
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
					{searchResults.length > 0 ? <ul className="contacts-search-results">{searchResults.map((entity) => this.renderListItem(entity, false))}</ul> : <EmptyList type="contactssearch" />}

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

		return <UserSearchField />;

		let {search, searchResults} = this.state;

		return (
			<div>
				<div className="search-field">
					<input type="search" ref="search" onChange={this.updateSearchQuery} value={search} placeholder={t('searchFieldPlaceholder')} />
					<div className={'icon ' + (search.length > 0 ? 'clear-search-icon' : 'search-icon')} onClick={this.clearSearch} />
				</div>
				<div>
					{this.resultsSummary(items, searchResults)}
					{this.searchResults()}
				</div>
			</div>
		);
	},

	beforeList (items) {
		return this.searchField(items);
	},

	toggleFollow (entity) {

		let p = entity.following ? areYouSure(t('unfollowPrompt')) : Promise.resolve();
		p = p.then(() => {
			this.setState({
				loading: true
			});
			return entity.follow()
				.then(() => {
					this.setState({
						following: entity.following,
						loading: false
					});
				});
		});
		return p;
	},

	renderListItem (item, removable=item.following) {
		return <SelectableEntity key={'avatar' + item.Username} entity={item} selected={item.following} onChange={this.toggleFollow} removable={removable} />;
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
					{items.length > 0 ? <ul className={'contacts-list users'}>{items}</ul> : <EmptyList type="contacts" />}
				</div>
				{this.afterList && this.afterList()}
			</div>
		);
	}

});
