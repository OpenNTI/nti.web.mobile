import React from 'react';

export default React.createClass({
	displayName: 'content:DiscussionItem',

	propTypes: {
		item: React.PropTypes.object
	},


	render () {
		let {item} = this.props;
		let {title, body, creator} = item;
		let date = item.getCreatedTime();

		return (
			<div className="discussion-item">
				{title}
				{body}
				{creator} {date}
			</div>
		);
	}
});
