import React from 'react';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import {Notice} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import groupDeletedItems from '../utils/group-deleted-items';

import ListItem from './list-items';

const DEFAULT_TEXT = {
	empty: 'There is nothing here.'
};

const t = scoped('forums.list', DEFAULT_TEXT);

export default class extends React.Component {
	static displayName = 'forums:List';

	static defaultProps = {
		groupDeleted: true
	};

	static propTypes = {
		container: PropTypes.shape({
			Items: PropTypes.array
		}).isRequired,

		emptyText: PropTypes.string,

		groupDeleted: PropTypes.bool,

		itemProps: PropTypes.object,

		topic: PropTypes.object,

		keyFn: PropTypes.func
	};

	keyFor = (item) => {
		return item.getID ? item.getID() : hash(item);
	};

	render () {
		const {
			container,
			emptyText = t('empty'),
			groupDeleted,
			itemProps,
			keyFn = this.keyFor,
			topic,
			...otherProps
		} = this.props;

		if (!container || !container.Items) {
			// console.error('List component requires a container prop.');
			return null;
		}


		let {Items} = container;

		let empty = Items.length === 0;

		if (!empty && groupDeleted) {
			Items = groupDeletedItems(Items);
		}

		return (empty ? (
			<Notice className="empty-list">{emptyText}</Notice>
		) : (
			<ul {...otherProps}>
				{Items.map((item, index)=>
					<li key={keyFn(item)}>{ListItem(item, index, {topic, ...itemProps})}</li>
				)}
			</ul>
		));
	}
}
