/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var ListItem = require('./FeedbackListItem');

module.exports = React.createClass({
	displayName: 'FeedbackList',

	render: function() {
		var feedback = this.props.feedback;
		var items = (feedback && feedback.Items) || [];

		return (
			<div className="feedback list">
			{items.map(
				i=>(<ListItem key={i.getID()} item={i}/>)
			)}
			</div>
		);
	}
});
