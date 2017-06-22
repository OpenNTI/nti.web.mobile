import React from 'react';
import PropTypes from 'prop-types';

import ListItem from './FeedbackListItem';

export default function FeedbackList ({feedback, onEditItem, onDeleteItem}) {

	let items = (feedback && feedback.Items) || [];

	return (
		<div className="feedback list">
		{items.map(
			i=>(<ListItem key={i.getID()} item={i}
				onEdit={onEditItem} onDelete={onDeleteItem}/>)
		)}
		</div>
	);
}

FeedbackList.propTypes = {
	feedback: PropTypes.shape({
		Items: PropTypes.array
	}),
	onDeleteItem: PropTypes.func,
	onEditItem: PropTypes.func
};
