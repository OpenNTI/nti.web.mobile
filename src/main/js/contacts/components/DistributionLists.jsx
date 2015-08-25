import React from 'react/addons';
import mixin from '../mixins/Mixin';
import {LISTS} from '../Constants';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import ListMeta from './ListMeta';
import {areYouSure} from 'prompts';
import {scoped} from 'common/locale';
import Err from 'common/components/Error';
import Loading from 'common/components/Loading';
import EmptyList from 'common/components/EmptyList';
import {Link} from 'react-router-component';

let t = scoped('CONTACTS');

export default React.createClass({
	displayName: 'Contacts:Groups',
	mixins: [mixin],
	storeType: LISTS,
	// listName: 'Distribution Lists',

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
		areYouSure(t('deleteListPrompt')).then(() => {
			this.setState({
				loading: true
			});
			item.delete()
				.then(() => {
					this.setState({
						loading: false
					});
				});
		});
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
				<Link href="/lists/new/" className="button tiny create-button">Create new list</Link>
				<div>
					{items.length > 0 ? <ul className={'contacts-list lists avatar-grid'}>{items}</ul> : <EmptyList type="contacts" />}
				</div>
				{this.afterList && this.afterList()}
			</div>
		);
	}

});
