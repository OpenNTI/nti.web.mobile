import React from 'react';

import {Loading} from 'nti-web-commons';
import Page from 'common/components/Page';

import Navigatable from 'common/mixins/NavigatableMixin';
import ContextSender from 'common/mixins/ContextSender';

import ContactsCommon from '../mixins/Mixin';
import {LISTS} from '../Constants';

import UserSearchField from './UserSearchField';

export default React.createClass({
	displayName: 'CreateList',
	mixins: [ContextSender, ContactsCommon, Navigatable],

	storeType: LISTS,

	getInitialState () {
		return {
			validTitle: false
		};
	},


	onSave () {
		const {newListName, userSearchField, state: {store}} = this;

		if (!store) {
			return;
		}

		let listName = newListName.value.trim();
		if(listName.length === 0) {
			return;
		}

		this.setState({ loading: true });

		let entities = userSearchField.getSelections();

		store.createList(listName, entities)
			.then(() => {
				this.navigateToLists();
			});
	},


	navigateToLists () {
		this.navigate('/lists/');
	},


	validateTitle () {
		const {newListName} = this;

		let {value} = newListName || {};

		this.setState({
			validTitle: value && value.trim().length > 0
		});
	},


	getContext () {
		return [
			{
				label: 'Lists',
				href: this.makeHref('/lists/')
			},
			{
				label: 'Create List'
			}
		];
	},


	render () {

		if (this.state.loading) {
			return <Loading />;
		}
		return (
			<Page title="Create List">
				<div id="create-list">
					<div><input ref={x => this.newListName = x} type="text" placeholder="Title" onChange={this.validateTitle}/></div>
					<UserSearchField
						ref={x => this.userSearchField = x}
						onCancel={this.navigateToLists}
						onSave={this.onSave}
						saveDisabled={!this.state.validTitle}
						placeholder="Add people to list"
						saveButtonText="Create List" />
				</div>
			</Page>
		);
	}
});
