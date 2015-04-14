import React from 'react';
import Mixin from './Mixin';
import Collapsible from '../Collapsible';
import List from '../List';
import {mimeTypes, DELETED_ITEM_GROUP} from '../../Constants';
import {scoped} from 'common/locale';
const t = scoped('FORUMS');

export default React.createClass({
	displayName: 'DeletedItemGroup',

	mixins: [
		Mixin
	],

	statics: {
		inputType: [
			mimeTypes[DELETED_ITEM_GROUP]
		]
	},

	propTypes: {
		item: React.PropTypes.object
	},

	render () {

		let {item} = this.props;
		let deletedItems = item.items;
		let numItems = deletedItems.length;
		let container = {
			Items: item.items
		};

		return (
			<div className="deleteditemgroup">
				<Collapsible title={t('deletedItemsMessage', {count: numItems})}>
					<List container={container} groupDeleted={false} />
				</Collapsible>
			</div>
		);
	}
});
