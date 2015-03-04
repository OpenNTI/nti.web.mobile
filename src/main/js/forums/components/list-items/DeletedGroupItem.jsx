import React from 'react';
import Mixin from './Mixin';
import {types} from '../../Constants';
import {scoped} from 'common/locale';
const t = scoped('FORUMS');

export default React.createClass({
	displayName: 'DeletedItemGroup',

	mixins: [
		Mixin
	],

	statics: {
		inputType: [
			types.DELETED_ITEM_GROUP
		]
	},

	render () {

		let {item} = this.props;
		let deletedItems = item.items;
		let numItems = deletedItems.length;

		return (
			<div className="deleteditemgroup">{t('deletedItemsMessage', {count: numItems})}</div>
		);
	}
});
