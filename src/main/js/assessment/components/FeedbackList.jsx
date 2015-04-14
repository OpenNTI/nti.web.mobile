import React from 'react';
import ListItem from './FeedbackListItem';

export default React.createClass({
	displayName: 'FeedbackList',

	propTypes: {
		feedback: React.PropTypes.shape({
			Items: React.PropTypes.array
		}),


		onDeleteItem: React.PropTypes.func,
		onEditItem: React.PropTypes.func
	},

	render () {
		let {feedback} = this.props;
		let items = (feedback && feedback.Items) || [];

		return (
			<div className="feedback list">
			{items.map(
				i=>(<ListItem key={i.getID()} item={i}
					onEdit={this.props.onEditItem} onDelete={this.props.onDeleteItem}/>)
			)}
			</div>
		);
	}
});
