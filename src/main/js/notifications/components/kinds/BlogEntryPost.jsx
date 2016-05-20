//TODO
import React from 'react';
import NoteableMixin from '../mixins/Noteable';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import {DateTime} from 'nti-web-commons';

export default React.createClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'forums.personalblogentrypost'
	},

	render () {
		let thestring = ' commented on a discussion.';
		return (
			<li className="notification-item">
				<Avatar entity={this.state.username} width="32" height="32"/>
				<div className="wrap">
					<DisplayName entity={this.state.username}/>
						{thestring}
					<DateTime date={this.getEventTime()} relative/>
				</div>
			</li>
		);
	}
});
