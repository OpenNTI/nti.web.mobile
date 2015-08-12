import React from 'react/addons';
import mixin from '../mixins/Mixin';
import {GROUPS} from '../Constants';
import AvatarProfileLink from 'profile/components/AvatarProfileLink';
import ListMeta from './ListMeta';
import {scoped} from 'common/locale';

let t = scoped('CONTACTS');

export default React.createClass({
	displayName: 'Contacts:Groups',
	mixins: [mixin],
	storeType: GROUPS,
	listName: 'Groups',

	getDefaultProps () {
		return {
			listClassName: 'groups avatar-grid'
		};
	},

	addGroup () {
		let {store} = this.state;
		if (!store) {
			return;
		}
		let name = this.refs.creationfield.getDOMNode().value.trim();
		if(name.length === 0) {
			return;
		}
		this.setState({
			loading: true
		});
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
			<div className="list-creation-form"><input type="text" ref="creationfield" placeholder={t('newGroupPlaceholder')}/><button className="tiny add-button" onClick={this.addGroup}>Add</button></div>
		);
	},

	renderListItem (item) {
		return (
			<li key={item.displayName}>
				<div>
					<AvatarProfileLink entity={item}><ListMeta entity={item} /></AvatarProfileLink>
				</div>
			</li>
		);
	}
});
