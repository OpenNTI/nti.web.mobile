import React from 'react/addons';
import mixin from '../mixins/Mixin';
import Loading from 'common/components/Loading';
import {USERS} from '../Constants';
import Err from 'common/components/Error';
import ContextSender from 'common/mixins/ContextSender';
import Selectables from './Selectables';
import UserSearchField from './UserSearchField';
import AddPeopleButton from './AddPeopleButton';

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
						<AddPeopleButton onClick={this.addPeople} />
						<Selectables
							linkToProfile
							entities={items}
							onChange={this.toggleFollow}
							labels={{selected: 'Remove', unselected: 'Undo'}}
						/>
					</div>
				}
			</div>
		);

	}

});
