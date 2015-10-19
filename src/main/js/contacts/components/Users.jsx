import React from 'react';

import ContextSender from 'common/mixins/ContextSender';
import C from 'common/components/Conditional';
import EmptyList from 'common/components/EmptyList';
import Loading from 'common/components/Loading';
import Err from 'common/components/Error';

import Selectables from './Selectables';
import UserSearchField from './UserSearchField';
import AddPeopleButton from './AddPeopleButton';

import mixin from '../mixins/Mixin';
import {USERS} from '../Constants';

export default React.createClass({
	displayName: 'Contacts:Users',
	mixins: [mixin, ContextSender],
	storeType: USERS,

	listName: 'Contacts',
	undos: {},

	getContext () {
		return Promise.resolve({
			label: 'Contacts'
		});
	},

	componentWillMount () {
		this.undos = {};
	},

	toggleFollow (entity) {
		this.setState({
			loading: true
		});
		let p = entity.following ? this.removeContact(entity) : this.addContact(entity);
		return p
			.then(() => {
				this.setState({
					loading: false
				});
			});
	},

	removeContact (entity) {
		let {store} = this.state;
		return store.removeContact(entity)
			.then(result => {
				if (result.undo) {
					this.undos[entity.getID()] = result.undo;
				}
			});
	},

	addContact (entity) {
		let undo = this.undos[entity.getID()];
		if (undo) {
			return undo().then(() => delete this.undos[entity.getID()]);
		}
		else {
			console.warn('No undo?');
			let {store} = this.state;
			return store.addContact(entity);
		}
	},

	addPeople () {
		this.setState({
			adding: true
		}, () => {
			this.refs.searchField.focus();
		});
	},

	cancelSearch () {
		this.setState({
			adding: false
		});
	},

	saveSearch () {
		let selections = this.refs.searchField.getSelections();
		let {store} = this.state;
		store.addContact(selections)
			.then(() => {
				this.setState({
					adding: false
				});
			});
	},

	render () {

		const {state: {adding, error, store}} = this;

		if (error) {
			return <Err error={error} />;
		}

		if (!store || store.loading) {
			return <Loading />;
		}

		let items = Array.from(store);

		return (
			<div>
				{adding ? (
					<div className="list-user-search">
						<UserSearchField
							ref="searchField"
							excludeContacts
							selected={items}
							onCancel={this.cancelSearch}
							onSave={this.saveSearch}
						/>
					</div>
				) : (
					<div>
						<AddPeopleButton onClick={this.addPeople} />
						<C condition={items.length === 0} tag={EmptyList} type="contacts" />
						<Selectables
							linkToProfile
							entities={items}
							onChange={this.toggleFollow}
							labels={{selected: 'Remove', unselected: 'Undo'}}
						/>
					</div>
				)}
			</div>
		);

	}

});
