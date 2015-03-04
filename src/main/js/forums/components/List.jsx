'use strict';

var React = require('react');
var ListItems = require('./list-items');
var hash = require('object-hash');
var Notice = require('common/components/Notice');
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
		var {Items} = this.props.container;
		var keyFor = this.props.keyFn || this.keyFor;
		var {itemProps} = this.props;
		var empty = Items.length === 0;
		var emptyText = this.props.emptyText || _t('emptyList');

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
