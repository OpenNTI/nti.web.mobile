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

	componentDidMount () {
		React.findDOMNode(this.refs.newListName).focus();
	},

	onSave () {
		let {store} = this.state;
		if (!store) {
			console.error('No store?');
			return;
		}
		let listName = this.refs.newListName.getDOMNode().value.trim();
		if(listName.length === 0) {
			return;
		}
		this.setState({
			loading: true
		});
		let entities = this.refs.userSearchField.getSelections();
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

	render () {

		if (this.state.loading) {
			return <Loading />;
		}
		return (
			<Page title="Create List">
				<GradientBackground>
					<div id="create-list">
						<div><input ref="newListName" type="text" placeholder="Title"/></div>
						<UserSearchField
							ref="userSearchField"
							onCancel={this.onCancel}
							onSave={this.onSave}
							placeholder="Add people to list"
							saveButtonText='Create List' />
					</div>
				</GradientBackground>
			</Page>
		);
	}
});
