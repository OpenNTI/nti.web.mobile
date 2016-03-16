import React from 'react';
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
	feedback: React.PropTypes.shape({
		Items: React.PropTypes.array
	}),
	onDeleteItem: React.PropTypes.func,
	onEditItem: React.PropTypes.func
};
