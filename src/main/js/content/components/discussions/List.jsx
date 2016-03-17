import React from 'react';

import Empty from 'common/components/EmptyList';
import Loading from 'common/components/Loading';

import Item from './Item';

export default function DiscussionsList ({children, items}) {
	return (
		<div className="discussions" {...this.props}>
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
