import React from 'react';
import SelectableEntity from './SelectableEntity';
import Api from '../Api';
import {USERS} from '../Constants';
// import EmptyList from 'common/components/EmptyList';
import cx from 'classnames';

export default React.createClass({
	displayName: 'UserSearchField',

	propTypes: {
		onChange: React.PropTypes.func,
		selected: React.PropTypes.array
	},

	getDefaultProps () {
		return {
			selected: []
		};
	},

	getInitialState () {
		return {
			selectedUsers: [],
			searchResults: [],
			contactsResults: []
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
		Api.getStore(USERS)
			.then(store => this.setState({store}));
	},

	focus () {
		this.refs.query.getDOMNode().focus();
	},

	selectionChange (user) {
		let {selectedUsers} = this.state;
		let {onChange} = this.props;
		let userId = user.getID();
		selectedUsers = selectedUsers.slice(0);
		let index = selectedUsers.findIndex((item) => item.getID() === userId);
		if ( index > -1) {
			selectedUsers.splice(index, 1);
		}
		else {
			selectedUsers.push(user);
		}
		this.setState({
			selectedUsers
		}, () => this.focus());
		if (onChange) {
			onChange(user);
		}
	},

	getSelections () {
		return this.state.selectedUsers;
	},

	queryChanged (event) {
		let query = event ? event.target.value : '';
		let {store} = this.state;

		this.setState({
			search: query,
			searchLoading: query.length > 0,
			searchResults: [],
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
				let contacts = [];
				for(let user of store) {
					if (store.entityMatchesQuery(user, query)) {
						contacts.push(user);
					}
				}
				let users = results.filter((entity) => entity.isUser);
				this.setState({
					searchResults: users,
					searchLoading: false,
					contactsResults: contacts
				});
			});
		}
	},

	renderResults (heading, results, classes) {
		let classnames = cx('contact-list search-results', classes);
		let {selectedUsers} = this.state;
		return (
			<section>
				<h1>{heading}</h1>
				<ul className={classnames}>
					{results.length > 0 ?
						results.map(entity =>
							<SelectableEntity
								key={'selectable-' + entity.getID()}
								entity={entity}
								selected={listContainsEntity(selectedUsers, entity) || listContainsEntity(this.props.selected, entity)}
								onChange={this.selectionChange.bind(this, entity)}
							/>)
						: <li>No results</li>
					}
				</ul>
			</section>
		);
	},

	render () {

		let {selectedUsers, searchResults, contactsResults} = this.state;

		return (
			<div className="user-search">
				<ul className="input-list">
					{selectedUsers.map(user => <li key={'selected-' + user.getID()} className="selected-item">{user.displayName}</li>)}
					<li className="input-field"><input type="text" className="search-input" ref="query" onChange={this.queryChanged} /></li>
				</ul>
				<ul className="output-list">
					<li>{this.renderResults('Contacts', contactsResults, 'contacts' )}</li>
					<li>{this.renderResults('Others', searchResults)}</li>
				</ul>
			</div>
		);
	}
});


function listContainsEntity (list, entity) {
	return (list || []).findIndex((user) => user.getID && user.getID() === entity.getID()) > -1;
}
