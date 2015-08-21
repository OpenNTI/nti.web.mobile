import React from 'react/addons';
import mixin from '../mixins/Mixin';
import Loading from 'common/components/Loading';
import {USERS} from '../Constants';
import Err from 'common/components/Error';
import ContextSender from 'common/mixins/ContextSender';
import SelectableEntities from './SelectableEntities';
import UserSearchField from './UserSearchField';

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

	toggleFollow (entity) {
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

		let {error, store} = this.state;

		if (error) {
			return <Err error={error} />;
		}

		if (!store || store.loading) {
			return <Loading />;
		}

		let items = [];
		for(let item of store) {
			items.push(item);
		}
		return (
			<div>
				{this.state.adding ?
					<div className="list-user-search">
						<UserSearchField
							ref="searchField"
							excludeContacts
							selected={items}
							onCancel={this.cancelSearch}
							onSave={this.saveSearch}
						/>
					</div>
					:
					<div>
						<div className="add-people" onClick={this.addPeople}>
							<i className="icon-add-user" />
							<span>Add People</span>
						</div>
						<SelectableEntities entities={items} onChange={this.toggleFollow} />
					</div>
				}
			</div>
		);

	}

});
