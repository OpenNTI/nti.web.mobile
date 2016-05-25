import React from 'react';

import Logger from 'nti-util-logger';

import {scoped} from 'nti-lib-locale';
import ContextSender from 'common/mixins/ContextSender';
import {EmptyList} from 'nti-web-commons';
import {Error as Err} from 'nti-web-commons';
import {Loading} from 'nti-web-commons';

import mixin from '../mixins/Mixin';
import {GROUPS} from '../Constants';

import GroupsListItem from './GroupsListItem';

const logger = Logger.get('contacts:components:Groups');
const t = scoped('CONTACTS');

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
		const {creationfield, state: {store}} = this;
		if (!store) {
			return;
		}

		let name = creationfield.value.trim();
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
			<div className="inline-creation-form">
				<input type="text" ref={x => this.creationfield = x} placeholder={t('newGroupPlaceholder')}/>
				<button className="tiny add-button" onClick={this.addGroup}>Add</button>
			</div>
		);
	},

	deleteGroup (group) {
		return group.delete()
			.catch(reason => {
				logger.error('There was an error while trying to delete a group: error: %o, group: %o', reason, group);

				//Continue the error.
				return Promise.reject(reason);
			});
	},

	renderListItem (item) {
		return <GroupsListItem item={item} onRightClick={this.deleteGroup} />;
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
					{items.length > 0 ? (
						<ul className={'contacts-list groups avatar-grid'}>{items}</ul>
					) : (
						<EmptyList type="dynamicfriendslists" />
					)}
				</div>
				{this.afterList && this.afterList()}
			</div>
		);
	}
});
