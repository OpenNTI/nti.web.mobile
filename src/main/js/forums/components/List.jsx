'use strict';

import React from 'react';
import ListItems from './list-items';
import hash from 'object-hash';
import Notice from 'common/components/Notice';
var _t = require('common/locale').scoped('FORUMS');
import groupDeleted from '../utils/group-deleted-items';

module.exports = React.createClass({
	displayName: 'ForumItemList',

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
		let emptyText = this.props.emptyText || _t('emptyList');

		return (
			empty ?
				<Notice>{emptyText}</Notice>
				:
				<ul {...this.props}>
					{groupDeleted(Items).map((item, index)=>
						<li key={keyFor(item)}>{ListItems.select(item, index, itemProps)}</li>
					)}
				</ul>
		);
	}
});
