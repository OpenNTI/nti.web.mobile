import React from 'react';

import hash from 'object-hash';

import Notice from 'common/components/Notice';

import {scoped} from 'common/locale';

import ListItem from './list-items';
import groupDeletedItems from '../utils/group-deleted-items';

const t = scoped('FORUMS');

export default React.createClass({
	displayName: 'forums:List',

	getDefaultProps () {
		return {
			groupDeleted: true
		};
	},

	propTypes: {
		container: React.PropTypes.shape({
			Items: React.PropTypes.array
		}).isRequired,

		emptyText: React.PropTypes.string,

		groupDeleted: React.PropTypes.bool,

		itemProps: React.PropTypes.object,

		keyFn: React.PropTypes.func
	},

	keyFor (item) {
		return item.getID ? item.getID() : hash(item);
	},

	render () {
		let {
			container,
			emptyText = t('emptyList'),
			groupDeleted,
			itemProps,
			keyFn = this.keyFor
		} = this.props;

		if (!container || !container.Items) {
			console.error('List component requires a container prop.');
			return null;
		}


		let {Items} = container;

		let empty = Items.length === 0;

		if (!empty && groupDeleted) {
			Items = groupDeletedItems(Items);
		}

		return (
			empty ?
				<Notice className="empty-list">{emptyText}</Notice>
				:
				<ul {...this.props}>
					{Items.map((item, index)=>
						<li key={keyFn(item)}>{ListItem(item, index, itemProps)}</li>
					)}
				</ul>
		);
	}
});
