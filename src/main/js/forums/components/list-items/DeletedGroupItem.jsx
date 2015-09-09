import React from 'react';
import Mixin from './Mixin';
import Collapsible from '../Collapsible';
import List from '../List';
import Avatar from 'common/components/Avatar';
import {mimeTypes, DELETED_ITEM_GROUP} from '../../Constants';
import {scoped} from 'common/locale';
const t = scoped('FORUMS');

export default React.createClass({
	displayName: 'list-items:DeletedGroupItem',

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

		let referenced = item.items.some(comment => comment.ReferencedByCount > 0);

		return (
			<div className="deleteditemgroup">
				<Avatar />
				<Collapsible triangle={numItems > 1 || referenced} title={t('deletedItemsMessage', {count: numItems})}>
					<List container={container} groupDeleted={false} />
				</Collapsible>
			</div>
		);
	}
});
