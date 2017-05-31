import PropTypes from 'prop-types';
import React from 'react';

import hash from 'object-hash';

import {Notice} from 'nti-web-commons';

import {scoped} from 'nti-lib-locale';

import ListItem from './list-items';
import groupDeletedItems from '../utils/group-deleted-items';

const t = scoped('FORUMS');

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

    render() {
		const {
			container,
			emptyText = t('emptyList'),
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

		return (
			empty ?
				<Notice className="empty-list">{emptyText}</Notice>
				:
				<ul {...otherProps}>
					{Items.map((item, index)=>
						<li key={keyFn(item)}>{ListItem(item, index, {topic, ...itemProps})}</li>
					)}
				</ul>
		);
	}
}
