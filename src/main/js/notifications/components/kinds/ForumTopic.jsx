//TODO
import React from 'react';
import NoteableMixin from '../mixins/Noteable';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'ForumTopic',
	mixins: [NoteableMixin],

	statics: {
		noteableType: ['forums.communityheadlinetopic']
	},

	render () {
		var discussionTitle = this.state.item.title;
		return (
			<li className="notification-item">
				<Avatar username={this.state.username} width="32" height="32"/>
				<div className="wrap">
					<DisplayName username={this.state.username}/>
						{" created a discussion: " + discussionTitle}
					<DateTime date={this.getEventTime()} relative/>
				</div>
			</li>
		);
	}
});
