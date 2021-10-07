import React from 'react';
import createReactClass from 'create-react-class';

import Logger from '@nti/util-logger';
import { scoped } from '@nti/lib-locale';
import { EmptyList, Error as Err, Loading } from '@nti/web-commons';
import { Button } from '@nti/web-core';
import ContextSender from 'internal/common/mixins/ContextSender';

import mixin from '../mixins/Mixin';
import { GROUPS } from '../Constants';

import GroupsListItem from './GroupsListItem';

const logger = Logger.get('contacts:components:Groups');

const DEFAULT_TEXT = {
	newGroupPlaceholder: 'Create a new group',
};

const t = scoped('contacts.groups', DEFAULT_TEXT);

export default createReactClass({
	displayName: 'Contacts:Groups',
	mixins: [mixin, ContextSender],
	storeType: GROUPS,
	listName: 'Groups',

	attachCreationFieldRef(x) {
		this.creationfield = x;
	},

	getContext() {
		return Promise.resolve({
			label: 'Groups',
		});
	},

	addGroup() {
		const {
			creationfield,
			state: { store },
		} = this;
		if (!store) {
			return;
		}

		let name = creationfield.value.trim();
		if (name.length === 0) {
			return;
		}

		this.setState({ loading: true });

		store.createGroup(name).then(() => {
			this.setState({
				loading: false,
			});
		});
	},

	beforeList() {
		return this.creationField();
	},

	creationField() {
		return (
			<div
				className="inline-creation-form"
				css={css`
					display: flex;
					input {
						flex: 1 1 auto;
					}
				`}
			>
				<input
					type="text"
					ref={this.attachCreationFieldRef}
					placeholder={t('newGroupPlaceholder')}
					css={css`
						border: 1px solid var(--primary-grey);
						border-right: 0;
						border-radius: 0;
						padding: 0 0.5em;
					`}
				/>
				<Button className="add-button" onClick={this.addGroup}>
					Add
				</Button>
			</div>
		);
	},

	deleteGroup(group) {
		return group.delete().catch(reason => {
			logger.error(
				'There was an error while trying to delete a group: error: %o, group: %o',
				reason,
				group
			);

			//Continue the error.
			return Promise.reject(reason);
		});
	},

	renderListItem(item) {
		return <GroupsListItem item={item} onRightClick={this.deleteGroup} />;
	},

	render() {
		let { error, search, store } = this.state;

		if (error) {
			return <Err error={error} />;
		}

		if (!store || store.loading) {
			return <Loading.Mask />;
		}

		let items = [];
		for (let item of store) {
			if (
				!store.entityMatchesQuery ||
				store.entityMatchesQuery(item, search)
			) {
				items.push(this.renderListItem(item));
			}
		}

		return (
			<div>
				{this.beforeList && this.beforeList(items)}
				<div>
					{this.listName && <h2>{this.listName}</h2>}
					{items.length > 0 ? (
						<ul className={'contacts-list groups avatar-grid'}>
							{items}
						</ul>
					) : (
						<EmptyList type="dynamicfriendslists" />
					)}
				</div>
				{this.afterList && this.afterList()}
			</div>
		);
	},
});
