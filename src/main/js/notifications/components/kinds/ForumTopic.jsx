/** @jsx React.DOM */
//TODO
'use strict';

var React = require('react/addons');
var NoteableMixin = require('../mixins/Noteable');
var Avatar = require('common/components/Avatar');
var DisplayName = require('common/components/DisplayName');
var DisplayDate = require('common/components/DisplayDate');

module.exports = React.createClass({
	displayName: 'ForumTopic',
	mixins: [NoteableMixin],

	statics: {
		noteable_type: 'forums.communityheadlinetopic'
	},

	render: function() {
		var discussionTitle = this.state.item.title;
		return (
			<li className="notification-item">
				<Avatar username={this.state.username} width="32" height="32"/>
				<div className="wrap">
					<DisplayName username={this.state.username}/>
						{" created a discussion: " + discussionTitle}
					<DisplayDate format="default" created={this.getCreatedTime()}/>
				</div>
			</li>
		);
	}
});
