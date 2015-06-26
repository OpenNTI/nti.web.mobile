import React from 'react';

import hash from 'object-hash';

import Notice from 'common/components/Notice';

import {scoped} from 'common/locale';

import ListItem from './list-items';
import groupDeleted from '../utils/group-deleted-items';

const t = scoped('FORUMS');

export default React.createClass({
	displayName: 'ForumItemList',

	getDefaultProps: function() {
		return {
			groupDeleted: true
		};
	},

	propTypes: {
		container: React.PropTypes.shape({
			Items: React.PropTypes.array
		}).isRequired
	},

	keyFor(item) {
		return item.getID ? item.getID() : hash(item);
	},

	render: function() {
		if (!this.props.container || !this.props.container.Items) {
			console.error('List component requires a container prop.');
			return null;
		}
		let {Items} = this.props.container;
		let keyFor = this.props.keyFn || this.keyFor;
		let {itemProps} = this.props;
		let empty = Items.length === 0;
		let emptyText = this.props.emptyText || t('emptyList');
		if (!empty && this.props.groupDeleted) {
			Items = groupDeleted(Items);
		}

		return (
			empty ?
				<Notice className="empty-list">{emptyText}</Notice>
				:
				<ul {...this.props}>
					{Items.map((item, index)=>
						<li key={keyFor(item)}>{ListItem(item, index, itemProps)}</li>
					)}
				</ul>
		);
	}
});
