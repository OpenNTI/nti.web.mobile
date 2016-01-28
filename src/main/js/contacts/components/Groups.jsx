import React from 'react';
import cx from 'classnames';
import SwipeToRevealOptions from 'react-swipe-to-reveal-options';

import Logger from 'nti-util-logger';

import {scoped} from 'common/locale';
import ContextSender from 'common/mixins/ContextSender';
import EmptyList from 'common/components/EmptyList';
import Err from 'common/components/Error';
import Loading from 'common/components/Loading';

import AvatarProfileLink from 'profile/components/AvatarProfileLink';

import mixin from '../mixins/Mixin';
import {GROUPS} from '../Constants';

import ListMeta from './ListMeta';

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
		const {refs: {creationfield}, state: {store}} = this;
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
				<input type="text" ref="creationfield" placeholder={t('newGroupPlaceholder')}/>
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

		const rightOptions = [];
		if(item.isModifiable) {
			rightOptions.push({
				label: 'Delete',
				class: cx('tiny button caution', {
					'disabled': !(item.delete && (!item.friends || item.friends.length === 0))
				})
			});
		}

		return (
			<li className="has-swipe-controls" key={item.getID()}>
				<SwipeToRevealOptions
					rightOptions={rightOptions}
					callActionWhenSwipingFarRight={false}
					onRightClick={() => this.deleteGroup(item)}
				>
					<AvatarProfileLink entity={item}>
						<ListMeta entity={item} />
					</AvatarProfileLink>
					{/*{item.delete && (!item.friends || item.friends.length === 0) && (
						<div className="delete" onClick={this.deleteGroup.bind(this, item)}/>
					)}*/}
				</SwipeToRevealOptions>
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
