import React from 'react';
import UserSearchField from './UserSearchField';
import mixin from '../mixins/Mixin';
import Navigatable from 'common/mixins/NavigatableMixin';
import {LISTS} from '../Constants';
import Loading from 'common/components/Loading';
import GradientBackground from 'common/components/GradientBackground';
import Page from 'common/components/Page';

export default React.createClass({
	displayName: 'CreateList',

	mixins: [mixin, Navigatable],
	storeType: LISTS,

	getInitialState () {
		return {
			validTitle: false
		};
	},

	componentDidMount () {
		// React.findDOMNode(this.refs.newListName).focus();
	},

	onSave () {
		const {refs: {newListName, userSearchField}, state: {store}} = this;

		if (!store) {
			console.error('No store?');
			return;
		}

		let listName = React.findDOMNode(newListName).value.trim();
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

	onCancel () {
		this.navigateToLists();
	},

	navigateToLists () {
		this.navigate('/lists/');
	},

	validateTitle () {
		let listNameField = React.findDOMNode(this.refs.newListName);
		this.setState({
			validTitle: listNameField && listNameField.value.trim().length > 0
		});
	},

	render () {

		if (this.state.loading) {
			return <Loading />;
		}
		return (
			<Page title="Create List">
				<GradientBackground>
					<div id="create-list">
						<div><input ref="newListName" type="text" placeholder="Title" onChange={this.validateTitle}/></div>
						<UserSearchField
							ref="userSearchField"
							onCancel={this.onCancel}
							onSave={this.onSave}
							saveDisabled={!this.state.validTitle}
							placeholder="Add people to list"
							saveButtonText="Create List" />
					</div>
				</GradientBackground>
			</Page>
		);
	}
});
