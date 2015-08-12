import React from 'react/addons';
import mixin from '../mixins/Mixin';
import {LISTS} from '../Constants';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import ListMeta from './ListMeta';

export default React.createClass({
	displayName: 'Contacts:Groups',
	mixins: [mixin],
	storeType: LISTS,
	listName: 'Distribution Lists',

	getDefaultProps () {
		return {
			listClassName: 'lists avatar-grid'
		};
	},

	addList () {
		let {store} = this.state;
		if (!store) {
			return;
		}
		let listName = this.refs.newListName.getDOMNode().value.trim();
		if(listName.length === 0) {
			return;
		}
		this.setState({
			loading: true
		});
		store.createList(listName)
			.then(() => {
				this.setState({
					loading: false
				});
			});
	},

	deleteList (item, event) {
		event.stopPropagation();
		event.preventDefault();
		this.setState({
			loading: true
		});
		item.delete()
			.then(() => {
				this.setState({
					loading: false
				});
			});
	},

	beforeList () {
		return this.creationField();
	},

	creationField () {
		return (
			<div className="list-creation-form"><input type="text" ref="newListName" /><button className="tiny add-button" onClick={this.addList}>Add</button></div>
		);
	},

	renderListItem (item) {
		return (
			<li key={item.getID()}>
				<a href={encodeForURI(item.getID())}>
					<Avatar entity={item} />
					<div className="body">
						<DisplayName entity={item} />
						<ListMeta entity={item} />
						{item.delete && <div className="delete" onClick={this.deleteList.bind(this, item)}></div>}
					</div>
				</a>
			</li>
		);
	}

});
