import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import Mixin from './Mixin';
import Collapsible from '../Collapsible';
import List from '../List';
import Avatar from 'common/components/Avatar';
import {mimeTypes, DELETED_ITEM_GROUP} from '../../Constants';
import {scoped} from 'nti-lib-locale';
const t = scoped('FORUMS');

export default createReactClass({
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
		item: PropTypes.object,
		topic: PropTypes.object
	},

	render () {

		const {item, topic} = this.props;
		const deletedItems = item.items;
		const numItems = deletedItems.length;
		const container = {
			Items: item.items
		};

		const referenced = item.items.some(comment => comment.ReferencedByCount > 0);

		return (
			<div className="deleteditemgroup">
				<Avatar />
				<Collapsible triangle={numItems > 1 || referenced} title={t('deletedItemsMessage', {count: numItems})}>
					<List container={container} groupDeleted={false} topic={topic} />
				</Collapsible>
			</div>
		);
	}
});
