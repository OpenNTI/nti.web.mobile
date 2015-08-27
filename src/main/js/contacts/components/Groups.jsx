import React from 'react/addons';
import mixin from '../mixins/Mixin';
import {GROUPS} from '../Constants';
import AvatarProfileLink from 'profile/components/AvatarProfileLink';
import ListMeta from './ListMeta';
import {scoped} from 'common/locale';
import ContextSender from 'common/mixins/ContextSender';
import Err from 'common/components/Error';
import Loading from 'common/components/Loading';
import EmptyList from 'common/components/EmptyList';

let t = scoped('CONTACTS');

export default React.createClass({
	displayName: 'Contacts:Groups',
	mixins: [mixin, ContextSender],
	storeType: GROUPS,
	listName: 'Groups',

	getContext () {
		return Promise.resolve({
			label: 'Groups'
		});
	},

	addGroup () {
		const {refs: {creationfield}, state: {store}} = this;
		if (!store) {
			return;
		}

		let name = React.findDOMNode(creationfield).value.trim();
		if(name.length === 0) {
			return;
		}

		this.setState({ loading: true });

		store.createGroup(name)
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
			<div className="inline-creation-form"><input type="text" ref="creationfield" placeholder={t('newGroupPlaceholder')}/><button className="tiny add-button" onClick={this.addGroup}>Add</button></div>
		);
	},

	renderListItem (item) {
		return (
			<li key={item.getID()}>
				<div>
					<AvatarProfileLink entity={item}><ListMeta entity={item} /></AvatarProfileLink>
				</div>
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
				{this.beforeList && this.beforeList(items)}
				<div>
					{this.listName && <h2>{this.listName}</h2>}
					{items.length > 0 ? <ul className={'contacts-list groups avatar-grid'}>{items}</ul> : <EmptyList type="contacts" />}
				</div>
				{this.afterList && this.afterList()}
			</div>
		);
	}
});
