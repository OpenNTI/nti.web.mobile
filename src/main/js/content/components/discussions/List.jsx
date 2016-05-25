import React from 'react';

import {EmptyList as Empty} from 'nti-web-commons';
import {Loading} from 'nti-web-commons';

import Item from './Item';

export default function DiscussionsList (props) {
	const {children, items} = props;
	return (
		<div className="discussions" {...props}>
			{children}
			<div className="list">
				{!items
					? ( <Loading/> )
					: items.length
						? items.map(x => <Item item={x} key={x.getID()}/>)
						: ( <Empty type="discussions"/> )
				}
			</div>
		</div>
	);
}

DiscussionsList.propTypes = {
	items: React.PropTypes.array,
	children: React.PropTypes.any
};
