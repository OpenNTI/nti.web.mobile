import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { scoped } from '@nti/lib-locale';
import Avatar from 'internal/common/components/Avatar';

import { mimeTypes, DELETED_ITEM_GROUP } from '../../Constants';
import Collapsible from '../Collapsible';
import List from '../List';

import Mixin from './Mixin';

const DEFAULT_TEXT = {
	deleted: {
		one: 'This comment has been deleted.',
		other: '%(count)s comments deleted.',
	},
};

const t = scoped('forums.comment', DEFAULT_TEXT);

export default createReactClass({
	displayName: 'list-items:DeletedGroupItem',

	mixins: [Mixin],

	statics: {
		inputType: [mimeTypes[DELETED_ITEM_GROUP]],
	},

	propTypes: {
		item: PropTypes.object,
		topic: PropTypes.object,
	},

	render() {
		const { item, topic } = this.props;
		const deletedItems = item.items;
		const numItems = deletedItems.length;
		const container = {
			Items: item.items,
		};

		const referenced = item.items.some(
			comment => comment.ReferencedByCount > 0
		);

		return (
			<div className="deleteditemgroup">
				<Avatar />
				<Collapsible
					triangle={numItems > 1 || referenced}
					title={t('deleted', { count: numItems })}
				>
					<List
						container={container}
						groupDeleted={false}
						topic={topic}
					/>
				</Collapsible>
			</div>
		);
	},
});
