import React from 'react';
import SelectableEntity from './SelectableEntity';
import Api from '../Api';
import {USERS} from '../Constants';
import cx from 'classnames';
import Loading from 'common/components/TinyLoader';
import listContainsEntity from '../list-contains-entity';

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
			search: '',
			selectedUsers: [],
			searchResults: [],
			contactsResults: [],
			suggestedContacts: []
		};
	},

	componentDidMount () {
		this.setUpStore();
		this.getSuggestedContacts();
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
		Api.getStore(USERS)
			.then(store => this.setState({store}));
	},

	getSuggestedContacts () {
		Api.getSuggestedContacts()
			.then(results => this.setState({
				suggestedContacts: results || []
			}));
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
						: <li className="no-results">No results</li>
					}
				</ul>
			</section>
		);
	},

	results () {
		let {searchResults, contactsResults, suggestedContacts, searchLoading, search} = this.state;
		let children = [];
		if (searchLoading) {
			children.push(<Loading/>);
		}
		else if (search.length === 0) {
			children.push(this.renderResults('Suggested Contacts', suggestedContacts));
		}
		else {
			children = children.concat(
				this.renderResults('Contacts', contactsResults, 'contacts' ),
				this.renderResults('Others', searchResults)
			);
		}
		return (
			<ul className="output-list">
				{children.map(child => <li>{child}</li>)}
			</ul>
		);
	},

	render () {

		let {selectedUsers} = this.state;

		return (
			<div className="user-search">
				<ul className="input-list">
					{selectedUsers.map(user => <li key={'selected-' + user.getID()} className="selected-item">{user.displayName}</li>)}
					<li className="input-field"><input type="text" className="search-input" ref="query" onChange={this.queryChanged} /></li>
				</ul>
				{this.results()}
				<div className="buttons">
					<button className="secondary button tiny" onClick={this.props.onCancel}>Cancel</button>
					<button className="primary button tiny" onClick={this.props.onSave}>Add Selected</button>
				</div>
			</div>
		);
	}
});
